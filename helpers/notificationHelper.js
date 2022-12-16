import pusherServer from "../lib/pusher";
import Notfications from "../models/notifications";
import mailTransport from "../lib/nodemailerTransport";
import Project from "../models/projects";
import User from "../models/users";
import Revision from "../models/revision";
import mongoose from "mongoose";
import { notificationEmailTemplate } from "./mailHtmlFiles";

export const triggerNotificationServer = async (receiver_id, message, path, type) => {
    if (!receiver_id) return;
    try {
        const notificationCreate = await Notfications.create({
            // sender: sender_id,
            receiver: receiver_id,
            type: !type ? "common" : type,
            path,
            message,
            created_at: new Date()
        })
        await pusherServer.trigger(receiver_id.toString(), "common-notifications", notificationCreate);
    } catch (e) {
    }
}

/**
 * 
 * @param {Array} emails 
 * @returns 
 */
export const sendNotifnMail = async (email, subject, htmlBody) => {
    if (!email) return;
    try {
        await mailTransport.sendMail({
            to: email,
            from: process.env.SEND_EMAIL_ID,
            subject: subject,
            html: htmlBody
        })
    } catch (e) {
    }
}


export const projectStatusNotifnMail = async (project_id, status, authUrl, subject, htmlBody) => {
    try {
        // getting email of users
        const details = await Project.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(project_id)
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
                $unwind: "$account"
            },
            {
                $lookup: {
                    from: "users",
                    let: { id: "$account.client_admin" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$id"],
                                },
                                "settings.email_notification": true
                            }
                        }
                    ],
                    as: "client_admin"
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { id: "$account.client_members.userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$id"]
                                },
                                "settings.email_notification": true
                            }
                        }
                    ],
                    as: "client_members"
                }
            },
            {
                $unwind: {
                    path: "$client_admin",
                    preserveNullAndEmptyArrays: true
                }
            }
            , {
                $project: {
                    client_admn: "$client_admin.email",
                    client_members: "$client_members.email",
                    pm: "$pm.email",
                    resource: "$resource.email",
                    _id: 0
                }
            }
        ]);
        const emails = details[0];
        if (!emails) {
            return;
        }

        if (!subject && status) {
            let message = "Tap to view project";
            switch (status) {
                case "to_be_confirmed":
                    subject = "Thankyou for your request";
                    message = "Thank you for submitting your request. A team has been assigned to your project. Let's get rolling!";
                    break;
                case "in_progress":
                    subject = "Project is in progress";
                    message = "Project is in progress";
                    break;
                case "u_review":
                    subject = "Project is under project manager review"
                    break;
                case "u_approval":
                    subject = "Check your project, we are waiting";
                    message = "Check this out! Your design is ready to review. Please check Design Revision.";
                    break;
                case "completed":
                    subject = "Hurray! Project completed";
                    message = "Congratulations! Your project has been completed successfully. Now on to the next one!";
                    break;
                case "on_hold":
                    subject = "Project is under hold";
                    break;
            }

            htmlBody = notificationEmailTemplate(message, authUrl);
        }

        if (emails.client_members) {
            emails.client_members.forEach(async mail => {
                await mailTransport.sendMail({
                    to: mail,
                    from: process.env.SEND_EMAIL_ID,
                    subject: subject,
                    html: htmlBody
                })
            })
        }
        await mailTransport.sendMail({
            to: emails.client_admn,
            from: process.env.SEND_EMAIL_ID,
            subject: subject,
            html: htmlBody
        })
    } catch (e) {
        console.log(e.message);
    }
}

export const projectNotification = async (project_id, status, path, message) => {
    try {
        const details = await Project.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(project_id)
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
                $unwind: "$account"
            },
            {
                $lookup: {
                    from: "users",
                    let: { id: "$account.client_admin" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$id"],
                                },
                                "settings.status_notification": true
                            }
                        }
                    ],
                    as: "client_admin"
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { id: "$account.client_members.userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$id"]
                                },
                                "settings.status_notification": true
                            }
                        }
                    ],
                    as: "client_members"
                }
            },
            {
                $unwind: {
                    path: "$client_admin",
                    preserveNullAndEmptyArrays: true
                }
            }
            , {
                $project: {
                    client_admn: "$client_admin",
                    client_members: "$client_members",
                    pm: "$pm.email",
                    resource: "$resource.email",
                    _id: 0
                }
            }
        ]);
        const users = details[0];
        if (!users) {
            return;
        }
        if (!message) {
            switch (status) {
                case "to_be_confirmed":
                    message = "Thank you for submitting your request. A team has been assigned to your project. Let's get rolling!";
                    break;
                case "in_progress":
                    message = "Project is in progress";
                    break;
                case "u_review":
                    message = "Your project is under project manager review"
                    break;
                case "u_approval":
                    message = "Check this out! Your design is ready to review. Please check Design.";
                    break;
                case "completed":
                    message = "Congratulations! Your project has been completed successfully. Now on to the next one!";
                    break;
                case "on_hold":
                    message = "Project is under hold";
                    break;
            }
        }

        if (users.client_members) {
            users.client_members?.forEach(async user => {
                const notificationCreate = await Notfications.create({
                    // sender: sender_id,
                    receiver: user._id,
                    type: "common",
                    path,
                    message,
                    created_at: new Date()
                })
                await pusherServer.trigger(user._id.toString(), "common-notifications", notificationCreate);
            })
        }

        if (users?.client_admn?._id) {
            const notificationCreate = await Notfications.create({
                // sender: sender_id,
                receiver: users?.client_admn?._id,
                type: "common",
                path,
                message,
                created_at: new Date()
            })
            await pusherServer.trigger(users?.client_admn?._id.toString(), "common-notifications", notificationCreate);
        }
    } catch (e) {
        console.log(e.message);
    }
}


export const projectAllNotfnHelper = async (body) => {
    try {
        const { project_id, path, client_message, pm_message, resource_message, resource_multiple } = body;

        if (client_message) {
            const details = await Project.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(project_id)
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
                    $unwind: "$account"
                },
                {
                    $lookup: {
                        from: "users",
                        let: { id: "$account.client_admin" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$id"],
                                    },
                                    "settings.status_notification": true
                                }
                            }
                        ],
                        as: "client_admin"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { id: "$account.client_members.userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ["$_id", "$$id"]
                                    },
                                    "settings.status_notification": true
                                }
                            }
                        ],
                        as: "client_members"
                    }
                },
                {
                    $unwind: {
                        path: "$client_admin",
                        preserveNullAndEmptyArrays: true
                    }
                }
                , {
                    $project: {
                        client_admn: "$client_admin",
                        client_members: "$client_members",
                        pm: "$pm.email",
                        resource: "$resource.email",
                        _id: 0
                    }
                }
            ]);
            const users = details[0];

            if (users?.client_members) {
                users.client_members?.forEach(async user => {
                    createNotification({ receiver: user._id, path, message: client_message, notify: true, })
                })
            }

            if (users?.client_admn?._id) {
                createNotification({ receiver: users?.client_admn?._id, path, message: client_message, notify: true })
            }
        }

        if (pm_message) {
            const project = await Project.findOne({ _id: project_id });
            const pm = await User.findOne({ _id: project.project_manager }) || {};
            createNotification({ receiver: pm?._id, path, message: pm_message, notify: true });
        }

        if (resource_message) {
            let aggregateQuery = [
                {
                    $match: {
                        project_id: mongoose.Types.ObjectId(project_id)
                    }
                },
            ]
            if (!resource_multiple) {
                aggregateQuery = [...aggregateQuery,
                {
                    $sort: {
                        revision_start_time: -1
                    }
                },
                {
                    $limit: 1
                }
                ]
            }
            aggregateQuery = [...aggregateQuery,
            {
                $lookup: {
                    from: "users",
                    let: { id: "$resource_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$id"]
                                }
                            }
                        }
                    ],
                    as: "user"
                }
            }
            ]
            const latestRevision = await Revision.aggregate(aggregateQuery);
            if (resource_multiple) {
                const resources = latestRevision[0]?.user || [];
                resources.forEach(async (user) => {
                    createNotification({ receiver: user?._id, path, message: resource_message, notify: true })
                })
            } else {
                const resource = latestRevision[0]?.user[0];
                createNotification({ receiver: resource?._id, path, message: resource_message, notify: true });
            }
        }
    } catch (e) {
        console.log(e);
    }
}

const createNotification = async (body) => {
    const { receiver, path, message, notify = false } = body;

    if (!receiver) return;

    const notificationCreate = await Notfications.create({
        // sender: sender_id,
        receiver,
        type: "common",
        path,
        message,
        created_at: new Date()
    })

    if (notify) {
        await pusherServer.trigger(receiver.toString(), "common-notifications", notificationCreate);

    }

}