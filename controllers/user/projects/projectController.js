import mongoose from "mongoose";
import { sendNotifnMail, triggerNotificationServer } from "../../../helpers/notificationHelper";
import projects from "../../../models/projects"
import jsonwebtoken from "jsonwebtoken";
import User from "../../../models/users";

export const addProjectFile = async (req, res) => {

    try {
        const token = req.headers.authorization;
        const ctoken = token.split(" ")[1];
        const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);

        const userDetails = await User.findOne({ _id: id });

        const { projectId, folder } = req.query
        let { files } = req.body
        if (!projectId) return res.status(400).json({ "error": "No  Project Id" })
        if (!folder) return res.status(400).json({ "error": "No  folder" })

        files = files.map(file => ({ ...file, user_id:userDetails?._id }))
        const folderQUery = folder === 'downloads' ? { download: { $each: files } } : { input: { $each: files } }

        const project = await projects.findOneAndUpdate({ _id: projectId }, { $addToSet: folderQUery })

        if (project?.project_status == "completed") {
            const clients = await projects.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(projectId)
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
                        localField: "account.client_admin",
                        foreignField: "_id",
                        as: "client_admin"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "account.client_members.userId",
                        foreignField: "_id",
                        as: "client_member"
                    }
                },
                {
                    $unwind: "$client_admin"
                },
                {
                    $project: {
                        client_member: 1, client_admin: 1
                    }
                }
            ])
            let clientAdmin = clients[0]?.client_admin || {};
            let clientMembers = clients[0]?.client_member ? clients[0]?.client_member : [];

            // notification client admin
            let email = clientAdmin.settings?.email_notification ? clientAdmin.email : null;
            let receiver_id = clientAdmin.settings?.status_notification ? clientAdmin._id : null;
            let path = `/projects/${projectId}?tab=DOWNLOAD`
            let message = "We've submitted your project files. Download Now"
            let authUrl = process.env.WEB_PROTOCOL + req.headers.host + path;
            let htmlBody = `<h1>${message}</h1><h3><a href="${authUrl}>Click here</a></h3>`;
            triggerNotificationServer(receiver_id, message, path);
            sendNotifnMail(email, "Alert..", htmlBody);

            // notification client members
            clientMembers.forEach(member => {
                email = member.settings?.email_notification ? member.email : null;
                receiver_id = member.settings?.status_notification ? member._id : null;
                triggerNotificationServer(receiver_id, message, path);
                sendNotifnMail(email, "Alert..", htmlBody);
            })
        }

        return res.status(201).json({})

    } catch (error) {
    }

}