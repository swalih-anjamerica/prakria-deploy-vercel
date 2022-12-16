import { NextApiRequest, NextApiResponse } from "next";
import jsonwebtoken from "jsonwebtoken";
import pusherServer from "../../lib/pusher";
import mongoose from "mongoose";
import User from "../../models/users";
import ProjectChat from "../../models/chats";
import { validateJWTToken } from "../../middlewares/userJWTAuth";
import Project from "../../models/projects";
import { sendNotifnMail, triggerNotificationServer } from "../../helpers/notificationHelper";
import convertToType from "../../helpers/typeConvert";
import Revision from "../../models/revision";
import { notificationEmailTemplate } from "../../helpers/mailHtmlFiles";

let chatNotfnTimeout;


const sendMessageOnProject = (req, res) => {
    return new Promise(async (resolve, reject) => {

        try {

            const { projectId, message, socketId, type } = req.body;
            const { chat_code } = req.query;

            if (!projectId) return resolve({ error: { error: "projectId required.", code: 400 }, status: 400 });
            if (!mongoose.isValidObjectId(projectId)) return resolve({ error: { error: "projectid should be valid objectId" }, status: 400 });

            const token = req.headers.authorization;
            if (!token) return resolve({ status: 404, error: "Unathorized" })

            const ctoken = token.split(" ")[1];
            if (ctoken === "null") {
                return resolve({ payload: { logedin: false, user: {}, role: null }, status: 404 })
            }

            if (!chat_code) {
                return resolve({ error: { error: "chat code must be required." }, status: 400 });
            }

            const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);
            const user = await User.findOne({ _id: id })

            const chatBody = {
                project_id: projectId,
                room_id: projectId + chat_code,
                user_id: id,
                user_role: user?.role,
                message: message,
                message_type: type ? type : "text",
                created_time: new Date(),
                seen: [
                    {
                        user_id: id,
                        seen_at: new Date()
                    }
                ]
            }

            // creating chat message
            const createChat = await ProjectChat.create(chatBody);

            const sendBody = {
                _id: createChat._id,
                user_id: createChat?.user_id,
                user_role: createChat?.user_role,
                created_time: createChat?.created_time,
                message: createChat?.message,
                message_type: createChat.message_type,
                socket_id: socketId,
                user_details: user
            }

            // chat notification
            clearTimeout(chatNotfnTimeout);
            chatNotfnTimeout = setTimeout(() => {
                sendChatNotificationHelper(projectId, chat_code, req);
            }, 10000);

            await pusherServer.trigger(projectId + chat_code, "project-chat", sendBody).catch(err => console.log(err));

            resolve({ payload: { success: true, messageBody: sendBody }, status: 200 })

        } catch (e) {
            reject({ error: e.message });
        }
    })
}


const getProjectChats = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { projectId } = req.query;
            if (!projectId) return resolve({ error: { error: "projectId required", code: 400 }, status: 400 });

            let { chat_code, page } = req.query;
            let limit = 20;
            if (!convertToType(page)) {
                page = 1;
            }
            if (!chat_code) {
                return resolve({ error: { error: "chat code must be required." }, status: 400 });
            }

            const projectChats = await ProjectChat.aggregate([
                {
                    $match: { room_id: projectId + chat_code }
                },
                {
                    $sort: {
                        created_time: -1
                    }
                },
                {
                    $skip: page * limit - limit
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_details"
                    }
                },
                {
                    $unwind: {
                        path: "$user_details",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);

            const projectChatCount = await ProjectChat.find({ room_id: projectId + chat_code }).count();

            if (!projectChats) return resolve({ status: 204 });
            resolve({ payload: { chats: projectChats, total: projectChatCount, projectId }, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const chatControllers = {
    sendMessageOnProject,
    getProjectChats
}
export default chatControllers;

// user scene contorller
export const chatSceneUserController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            // there is a chat code for seprate both team connect chat and project client chat. 
            // chat_code for project = _project
            // chat code for team_connect = _team
            const { project_id, chat_code } = req.body;

            await ProjectChat.updateMany({ room_id: project_id + chat_code, "seen.user_id": { $ne: user._id } }, {
                $push: {
                    seen: {
                        user_id: user._id,
                        seen_at: new Date()
                    }
                }
            })
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

async function sendChatNotificationHelper(projectId, chat_code, req) {
    try {
        const users = await Project.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(projectId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "project_manager",
                    foreignField: "_id",
                    as: "pm"
                }
            },
            {
                $unwind: {
                    path: "$pm",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "account_id",
                    foreignField: "_id",
                    as: "account"
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "account.client_admin",
                    as: "client_admin"
                }
            },
            {
                $unwind: {
                    path: "$client_admin",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "users.client_admin": "$client_admin", "users.pm": "$pm"
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": "$users"
                }
            }
        ]);

        const pm = users[0]?.pm;
        const clientAdmin = users[0].client_admin;

        const project = await Project.findOne({ _id: projectId });
        let pmUnseenChats;
        let clientAdminUnseenChats;

        if (clientAdmin) {
            clientAdminUnseenChats = await ProjectChat.find({ room_id: projectId + chat_code, "seen.user_id": { $ne: clientAdmin._id } }).count();
        }
        if (pm) {
            pmUnseenChats = await ProjectChat.find({ room_id: projectId + chat_code, "seen.user_id": { $ne: pm._id } }).count();
        }

        let receiver_id;
        let path = chat_code == "_project" ? `/projects/${projectId}?tab=CONNECT` : `/team-connect?room=${projectId}`
        let email;
        let message;
        let authUrl = process.env.WEB_PROTOCOL + req.headers.host + path;
        let htmlFile;

        if (pmUnseenChats > 0) {
            receiver_id = pm?.settings?.chat_notification ? pm._id : null;
            email = pm?.settings?.email_notification ? pm.email : null;
            message = `Your have ${pmUnseenChats} new messages from ${clientAdmin?.first_name + " " + clientAdmin?.last_name} & team on "${project.title}"`
            triggerNotificationServer(receiver_id, message, path);

            htmlFile = notificationEmailTemplate(message, authUrl);
            sendNotifnMail(email, "New messages..", htmlFile);
        }
        if (chat_code === "_project") {
            if (clientAdminUnseenChats > 0) {
                receiver_id = clientAdmin?.settings?.chat_notification ? clientAdmin._id : null;
                email = clientAdmin?.settings?.email_notification ? clientAdmin.email : null;
                message = `Your have ${clientAdminUnseenChats} new messages from ${pm?.first_name + " " + pm?.last_name} on "${project.title}"`
                triggerNotificationServer(receiver_id, message, path);

                htmlFile = notificationEmailTemplate(message, authUrl);
                sendNotifnMail(email, "New messages..", htmlFile);
            }
        } else if (chat_code === "_team") {
            const designers = await Revision.aggregate([
                {
                    $match: {
                        project_id: mongoose.Types.ObjectId(projectId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "resource_id",
                        foreignField: "_id",
                        as: "designers"
                    }
                },
                {
                    $unwind: "$designers"
                },
                {
                    $group: {
                        _id: {
                            "_id": "$designers._id",
                            "first_name": "$designers.first_name",
                            "last_name": "$designers.last_name",
                            "email": "$designers.email",
                            "settings": "$designers.settings"
                        }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$_id"
                    }
                }
            ]);
            let desigerUnseenChat;
            let designer;
            for (let i = 0; i < designers.length; i++) {
                designer = designers[i];
                desigerUnseenChat = await ProjectChat.find({ room_id: projectId + chat_code, "seen.user_id": { $ne: designer._id } }).count();
                if (desigerUnseenChat > 0) {
                    receiver_id = designer?.settings?.chat_notification ? designer._id : null;
                    email = designer?.settings?.email_notification ? designer.email : null;
                    message = `Your have ${desigerUnseenChat} new messages from ${pm?.first_name + " " + pm?.last_name} on "${project.title}"`
                    triggerNotificationServer(receiver_id, message, path);

                    htmlFile = notificationEmailTemplate(message, authUrl);
                    sendNotifnMail(email, "New messages..", htmlFile);
                }
            }
        }

    } catch (e) {
    }
}
