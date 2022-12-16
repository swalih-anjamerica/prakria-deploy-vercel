import Rivision from "../../models/revision";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import User from "../../models/users";
import Account from "../../models/accounts";
import Project from "../../models/projects";
import { validateJWTToken } from "../../middlewares/userJWTAuth";
import pusherServer from "../../lib/pusher";
import { projectNotification, projectStatusNotifnMail, sendNotifnMail, triggerNotificationServer } from "../../helpers/notificationHelper";
import { notificationEmailTemplate } from "../../helpers/mailHtmlFiles";
import userService from "../../server/services/user.services";

const controllers = {
    listResources: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { data: allResources } = await userService.listDesigners({ ...req.query });

                resolve({ payload: allResources, status: 200 });
            } catch (e) {
                reject(e);
            }
        })
    },

    addNewRivision: function (req, res) {
        return new Promise(async (resolve, reject) => {
            try {

                const { project_id, resource_id, rivision_file } = req.body;
                const user = req.user;

                const getProject = await Project.findOne({ _id: project_id });
                if (getProject.status === "completed") {
                    return resolve({ error: { error: "This project has finished", code: 400 }, status: 400 });
                }
                // declining previous revision if the user commened on it
                const data = await Rivision.updateMany({
                    project_id, $or: [
                        { rivision_status: "u_approval" },
                        { rivision_status: "client_commented" }
                    ], "$expr": { $gte: [{ $size: "$comments" }, 1] }
                }, {
                    $set: {
                        rivision_status: "client_rejected"
                    }
                })

                // check previous revision are not completed
                const isRivisionNotCompeted = await Rivision.exists({
                    project_id: project_id, $and: [
                        { rivision_status: { $ne: "completed" } },
                        { rivision_status: { $ne: "client_rejected" } },
                        { rivision_status: { $ne: "prakria_rejected" } },
                        { rivision_status: { $ne: "client_commented" } },
                    ]
                })
                if (isRivisionNotCompeted) {
                    return resolve({ error: { error: "previous revision not completed", code: 400 }, status: 400 });
                }
                // check exisiting title
                const prevRevision = await Rivision.findOne({ project_id }).sort({ revision_start_time: -1 });
                await Rivision.create({
                    project_id,
                    resource_id,
                    rivision_file,
                    title: !prevRevision ? "Revision 1" : "Revision " + (parseInt(prevRevision?.title?.split(" ")[1]) + 1),
                    revision_start_time: new Date(),
                    start_date: new Date()
                })

                const project = await Project.findOneAndUpdate({ _id: project_id }, {
                    $set: {
                        project_status: "in_progress",
                        resource: resource_id,
                        update_date: new Date()
                    }
                })

                await pusherServer.trigger(project_id, "project-update", {
                    action: "new_revision_created",
                    created: new Date()
                });
                await pusherServer.trigger(resource_id, "project-new-revision", {});

                // notification
                const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + project_id;
                // projectStatusNotifnMail(project_id, "in_progress", authUrl)
                // projectNotification(project_id, "in_progress", authUrl)

                // pm notification
                const des = await User.findOne({ _id: resource_id });
                let notifnMessage = `You have successfully added ${des.first_name + " " + des.last_name} to the "${project?.title}" team`;
                let htmlBody = notificationEmailTemplate(notifnMessage, authUrl + "?tab=ADD_RESOURCE");

                let path = `/projects/${project_id}?tab=ADD_RESOURCE`;
                triggerNotificationServer(user._id, notifnMessage, path);
                sendNotifnMail(user.email, "Alert..", htmlBody);

                resolve({ payload: { success: true, message: "rivision created successfully.", code: 200 }, status: 200 });
            } catch (e) {
                if (e.errors) {
                    return resolve({ error: e.errors, status: 400 });
                }

                reject({ error: e.message });
            }
        })
    },

    /**
     * 
     * @param {NextApiRequest} req 
     * @param {NextApiResponse} res 
     * @returns 
     */
    getAllRivision: function (req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await validateJWTToken(req, res);
                const { params } = req.query;

                const projectId = params[1];

                if (!projectId) return resolve({ error: { error: true, message: "projectId parameter required.", code: 400 }, status: 400 });
                if (!mongoose.isValidObjectId(projectId)) return resolve({ error: { error: true, message: "projectId parameter must be valid objectId.", code: 400 }, status: 400 });

                let searchQuery = {
                    project_id: projectId
                }
                if (user?.role == "client_admin" || user?.role === "client_member") {
                    searchQuery = {
                        ...searchQuery, $or: [
                            { rivision_status: "u_approval" },
                            { rivision_status: "completed" },
                            { rivision_status: "client_rejected" },
                            { rivision_status: "client_commented" },
                        ]
                    }
                }
                if (user.role === "designer") {
                    const latestRevision = await Rivision.findOne({ project_id: projectId }).sort({ revision_start_time: -1 })
                    if (latestRevision.resource_id?.toString() !== user._id.toString()) {
                        searchQuery = {
                            ...searchQuery,
                            resource_id: user._id
                        }
                    }
                }
                let sortMethod = user.role == "designer" ? -1 : -1;
                const allRivisions = await Rivision.find(searchQuery).sort({ revision_start_time: sortMethod }).lean();
                // if (allRivisions.length < 1) {
                //     resolve({ payload: [], status: 204 })
                // } else {
                //     resolve({ payload: allRivisions, status: 200 });
                // }
                resolve({ payload: allRivisions, status: 200 });
            } catch (e) {
                reject({ error: e.message });
            }
        })
    },

    /**
     * 
     * @param {NextApiRequest} req 
     * @param {NextApiResponse} res 
     * @returns 
     */
    getRivisionById: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {

                const { params } = req.query;

                const rivisionId = params[1];


                if (!rivisionId) return resolve({ error: { error: true, message: "rivisionId parameter required.", code: 400 }, status: 400 });
                if (!mongoose.isValidObjectId(rivisionId)) return resolve({ error: { error: true, message: "rivisionId parameter must be valid objectId.", code: 400 }, status: 400 });

                const rivisionDetails = await Rivision.findOne({ _id: rivisionId }, { comments: 0 }).lean();
                const rivisionComments = await Rivision.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(rivisionId)
                        }
                    },
                    {
                        $unwind: "$comments"
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "comments.comment_user_id",
                            foreignField: "_id",
                            as: "users"
                        }
                    },
                    {
                        $unwind: "$users"
                    },
                    {
                        $addFields: {
                            comments: {
                                user: "$users"
                            }
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: "$comments"
                        }
                    }
                ])
                const projectDet = await Project.findOne({ _id: rivisionDetails.project_id });
                const latestRevision = await Rivision.findOne({ project_id: rivisionDetails.project_id }).sort({ revision_start_time: -1 }).lean();
                const latest = rivisionDetails._id.toString() === latestRevision._id.toString();

                if (!rivisionDetails) {
                    resolve({ status: 204 })
                } else {
                    resolve({
                        payload: {
                            ...rivisionDetails,
                            comments: rivisionComments,
                            latest,
                            project: projectDet
                        }, status: 200
                    });
                }

            } catch (e) {
                reject({ error: e.message });
            }
        })
    },


    /**
     * @method PUT
     * @param {NextApiRequest} req 
     * @param {NextApiResponse} res 
     */
    addNewComment: function (req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                let { rivision_id, comments } = req.body;
                if (!(comments instanceof Array)) comments = [comments];
                const user = await validateJWTToken(req, res);

                if (!rivision_id) return resolve({ error: { error: true, message: "rivision_id required.", code: 400 }, status: 400 });

                if (!mongoose.isValidObjectId(rivision_id)) return resolve({ error: { error: true, message: "rivision_id must be valid objectId. ", code: 400 }, status: 400 });

                const revisionDetails = await Rivision.findOne({ _id: rivision_id });

                if (!revisionDetails) {
                    return resolve({ error: { error: "revision not found" }, status: 400 });
                }

                let revisionStatus = (user.role == "project_manager" && revisionDetails.rivision_status !== "client_commented") ?
                    "prakria_rejected" :
                    (user.role == "client_admin" || user.role === "client_member") ? "client_commented" :
                        revisionDetails.rivision_status;

                const { modifiedCount } = await Rivision.updateOne({ _id: rivision_id }, {
                    $push: {
                        comments: { $each: comments }
                    },
                    $set: {
                        rivision_status: revisionStatus
                    }
                })
                // if comment added is project manager we have to created a new revision 
                // && revisionDetails.comments?.length < 1
                const latestRevision = await Rivision.findOne({}).sort({ revision_start_time: -1 });
                let authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/revision/" + rivision_id;
                const revisionPath = `/projects/revision/${rivision_id}`;


                if (user.role === "project_manager" && revisionDetails.comments?.length < 1 && latestRevision?._id == rivision_id) {
                    const revisionNumber = (parseFloat(revisionDetails?.title?.split(" ")[1]) + 0.1).toFixed(1);
                    await Rivision.create({
                        project_id: revisionDetails.project_id,
                        resource_id: revisionDetails.resource_id,
                        title: "Revision " + revisionNumber,
                        revision_start_time: new Date(),
                        start_date: new Date()
                    })

                    const project = await Project.findOneAndUpdate({ _id: revisionDetails.project_id }, {
                        $set: {
                            project_status: "in_progress",
                            resource: revisionDetails.resource_id,
                            update_date: new Date()
                        }
                    })

                    // pusher
                    await pusherServer.trigger(revisionDetails.project_id?.toString(), "project-update", {
                        action: "new_revision_created",
                        created: new Date()
                    });
                    await pusherServer.trigger(revisionDetails.resource_id.toString(), "project-new-revision", {});

                    // notification for resource when project manager comment on project
                    const resource = await User.findOne({ _id: revisionDetails.resource_id });
                    const resourceNtfnMessage = "Feedback received from project manager on project " + project.title;
                    const resourceNtfnEmail = notificationEmailTemplate(resourceNtfnMessage, authUrl);
                    triggerNotificationServer(resource?._id, resourceNtfnMessage, revisionPath)
                    sendNotifnMail(resource?.email, "Alert", resourceNtfnEmail);
                } else {
                    const project = await Project.findOneAndUpdate({ _id: revisionDetails.project_id }, {
                        $set: {
                            project_status: "in_progress"
                        }
                    })

                    if (revisionDetails.comments.length < 1) {
                        // pm notification
                        const { project_manager, title } = project || {};
                        const pm = await User.findOne({ _id: project_manager });
                        const pmNtfnMsg = `Feedback received from ${user.first_name + " " + user.last_name}!`;
                        const subject = "Alert..";
                        // const pmNotfHtml = `<h1>Feedback received from ${user.first_name + " " + user.last_name}!</h1><h3><a href="${authUrl}">Click to view revision</a></3>`
                        const pmNotfHtml = notificationEmailTemplate(pmNtfnMsg, authUrl);
                        triggerNotificationServer(pm?._id, pmNtfnMsg, revisionPath);
                        sendNotifnMail(pm?.email, subject, pmNotfHtml);
                    }


                }
                if (modifiedCount < 1) {
                    resolve({ error: { error: true, message: "rivision comment not added.", code: 400 }, status: 400 });
                } else {
                    resolve({ payload: { success: true, message: "rivision comment added successfully.", code: 200, modifiedCount }, status: 200 })
                }

            } catch (e) {
                if (e.errors) {
                    return resolve({ error: e.errors, status: 400 });
                }

                reject({ error: e.message });
            }
        })
    },

    /**
     * 
     * @param {NextApiRequest} req 
     * @param {NextApiResponse} res 
     */
    checkPreviousRivisionCompleted: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {

                const project_id = req.query.params[1];

                if (!project_id) return resolve({ error: { error: "project_id required", code: 400 }, status: 400 });

                const notCompleteRevision = await Rivision.aggregate([
                    {
                        $match: {
                            project_id: mongoose.Types.ObjectId(project_id),
                            $and: [
                                { rivision_status: { $ne: "completed" } },
                                { rivision_status: { $ne: "client_rejected" } },
                            ],
                            comments: { $size: 0 }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "resource_id",
                            foreignField: "_id",
                            as: "resource_id"
                        }
                    },
                    {
                        $unwind: {
                            path: "$resource_id"
                        }
                    },
                    {
                        $lookup: {
                            from: "skills",
                            localField: "resource_id.skills.id",
                            foreignField: "_id",
                            as: "resource_skills"
                        }
                    },

                ])
                return resolve({ payload: { notComplete: notCompleteRevision[0], code: 200 }, status: 200 });
            } catch (e) {
                reject({ error: e.message });
            }
        })
    },

    updateRivisonResource: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { revision_id, resource_id } = req.body;
                const revisonDetails = await Rivision.findOne({ _id: revision_id });

                if (!revisonDetails) {
                    return resolve({ error: { error: "rivision not found" }, status: 400 });
                }
                if (revisonDetails.rivision_status === "u_approval") {
                    return resolve({ error: { error: "The revision is under approval. You can't assign any resource until getting feedback from the client." }, status: 400 })
                }
                if (revisonDetails.rivision_status === "u_review") {
                    return resolve({ error: { error: "The revision is under approval. You can't update resource until you or creative director approve or declien revision." }, status: 400 })
                }
                const oldResourceId = revisonDetails.resource_id;
                const { modifiedCount } = await Rivision.updateOne({ _id: revision_id },
                    {
                        $set: {
                            resource_id,
                            start_time: new Date()
                        },
                        $push: {
                            history: {
                                resource_id: revisonDetails.resource_id,
                                start_time: revisonDetails.start_time,
                                end_time: new Date()
                            }
                        }
                    })

                await Project.updateOne({ _id: revisonDetails.project_id }, {
                    $set: {
                        resource: resource_id,
                        update_date: new Date()
                    }
                })

                await pusherServer.trigger(revisonDetails.project_id?.toString(), "project-update", {
                    action: "new_revision_created",
                    created: new Date()
                });
                await pusherServer.trigger(resource_id, "project-new-revision", {});
                await pusherServer.trigger(oldResourceId.toString(), "project-new-revision", {});
                resolve({ payload: { success: true }, status: 200 });
            } catch (e) {
                if (e.errors) {
                    resolve({ error: e.errors, status: 400 })
                } else {
                    reject({ error: e.message });
                }
            }
        })
    },

    /**
     * 
     * @param {NextApiRequest} req 
     * @param {NextApiResponse} res 
     * @returns 
     */
    updateRevisionFile: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await validateJWTToken(req, res);
                const { revision_id, rivision_file, file_size } = req.body;
                const revisionDetails = await Rivision.findOne({ _id: revision_id });
                const updateRevision = await Rivision.updateOne({ _id: revision_id }, {
                    $set: {
                        rivision_file,
                        file_size,
                        end_time: new Date(),
                        rivision_status: "u_review"
                    }
                });
                const project = await Project.findOneAndUpdate({ _id: revisionDetails.project_id }, {
                    $set: {
                        project_status: "u_review",
                        update_date: new Date()
                    },
                    $unset: {
                        resource: 1
                    }
                })
                await pusherServer.trigger(revisionDetails.project_id?.toString(), "project-update", {
                    action: "revision_file_updated",
                    created: new Date()
                });

                // notification
                let authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + revisionDetails.project_id;
                // projectStatusNotifnMail(revisionDetails.project_id, "u_review", authUrl)
                // projectNotification(revisionDetails.project_id, "u_review", authUrl)

                // pm notification
                const { project_manager, title } = project || {};
                const pm = await User.findOne({ _id: project_manager });
                const pmNtfnMsg = `${user.first_name + " " + user.last_name} has sent "${title}" for review. Check now!`;
                const subject = "Alert..";
                authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/revision/" + revision_id;
                // const pmNotfHtml = `<h1>${user.first_name + " " + user.last_name} has sent "${title}" for review. Check now!</h1><h3><a href="${authUrl}">Click to view revision</a></3>`
                const pmNotfHtml = notificationEmailTemplate(pmNtfnMsg, authUrl);
                const revisionPath = `/projects/revision/${revision_id}`;
                triggerNotificationServer(pm?._id, pmNtfnMsg, revisionPath);
                sendNotifnMail(pm?.email, subject, pmNotfHtml);


                resolve({ payload: { success: true }, status: 200 })
            } catch (e) {
                if (e.errors) {
                    resolve({ error: e.errors, status: 400 })
                } else {
                    reject({ error: e.message })
                }
            }
        })
    },

    /**
     * 
     * @param {NextApiRequest} req 
     * @param {NextApiResponse} res 
     * @returns 
     */
    updateRevisionController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { rivision_file, resource_id, title, start_time, end_time, rivision_status, revision_id } = req.body;
                const updateBody = {
                    rivision_file, resource_id, title, start_time, end_time, rivision_status
                }
                const { modifiedCount } = await Rivision.updateOne({ _id: revision_id }, {
                    $set: updateBody
                })
                if (modifiedCount < 1) {
                    return resolve({ error: "Not updated", status: 400 });
                }
                await pusherServer.trigger(project_id, "project-update", {
                    action: "revision_udpate",
                    created: new Date()
                });
                resolve({ payload: { success: true, message: "Resource updated." }, status: 200 })
            } catch (e) {
                if (e.errors) {
                    resolve({ error: e.errors, status: 400 });
                } else {
                    reject({ error: e.message });
                }
            }
        })
    },

    approveProjectManagerRevisionController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { revision_id } = req.body;
                const user = await validateJWTToken(req, res);
                if (user.role !== "project_manager") {
                    return resolve({ error: { error: "this user is not a project manager." }, status: 400 });
                }
                const revisionDetails = await Rivision.findOne({ _id: revision_id });
                const { modifiedCount } = await Rivision.updateOne({ _id: revision_id }, {
                    $set: {
                        rivision_status: "u_approval"
                    }
                })
                if (modifiedCount < 1) {
                    return resolve({ error: { error: "not updated", modifiedCount }, status: 400 })
                }
                const project = await Project.findOneAndUpdate({ _id: revisionDetails.project_id }, {
                    $set: {
                        project_status: "u_approval"
                    }
                })

                // notification
                const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/revision/" + revisionDetails._id;
                projectStatusNotifnMail(revisionDetails.project_id, "u_approval", authUrl)
                projectNotification(revisionDetails.project_id, "u_approval", authUrl);

                // pm notification
                if (project) {
                    let clientAdmin = await Account.aggregate([
                        {
                            $match: {
                                _id: mongoose.Types.ObjectId(project.account_id)
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                foreignField: "_id",
                                localField: "client_admin",
                                as: "client"
                            }
                        },
                        {
                            $unwind: "$client"
                        }
                    ])

                    let client = clientAdmin[0].client;
                    let message = `"${project.title}" was successfully sent to ${client?.first_name + " " + client?.last_name} for review.`;
                    let htmlBody = notificationEmailTemplate(message);

                    triggerNotificationServer(user?._id, message, authUrl);
                    sendNotifnMail(user.email, "Alert..", htmlBody);
                }


                await pusherServer.trigger(revisionDetails.project_id?.toString(), "project-update", {
                    action: "project_manager_approved",
                    created: new Date()
                });
                resolve({ payload: { success: true, message: "revision project manager approved successfully." }, status: 200 });
            } catch (e) {
                if (e.errors) {
                    resolve({ error: e.errors, status: 400 })
                } else {
                    reject({ error: e.message })
                }
            }
        })
    },

    declinePrakriaRevisionController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { revision_id } = req.body;
                const user = await validateJWTToken(req, res);
                if (user.role !== "project_manager") {
                    return resolve({ error: { error: "only project manager can decline prakria revision" }, status: 401 })
                }
                if (!mongoose.isValidObjectId(revision_id)) {
                    return resolve({ error: { error: "revision_id should be valid objectId" }, status: 400 })
                }
                const revisionDetails = await Rivision.findOne({ _id: revision_id });
                const { modifiedCount } = await Rivision.updateOne({ _id: revision_id }, {
                    $set: {
                        rivision_status: "prakria_rejected"
                    }
                })
                await Project.updateOne({ _id: revisionDetails.project_id }, {
                    $set: {
                        resource: revisionDetails?.resource_id
                    }
                })
                await pusherServer.trigger(revisionDetails?.resource_id?.toString(), "project-new-revision", {});
                if (modifiedCount < 1) {
                    return resolve({ payload: { success: false, message: "not updated" }, status: 400 })
                }
                await Project.updateOne({ _id: revisionDetails.project_id }, {
                    $set: {
                        project_status: "in_progress"
                    }
                })

                // pusher
                await pusherServer.trigger(revisionDetails.project_id?.toString(), "project-update", {
                    action: "prakria_revision_decliened",
                    created: new Date()
                });

                // notification
                // const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + revisionDetails.project_id;
                // await projectStatusNotifnMail(revisionDetails.project_id, "in_progress", authUrl)

                resolve({ payload: { success: true, message: "revision declined by " + user.role }, status: 200 });
            } catch (e) {
                if (e.errors) {
                    resolve({ error: e.errors, status: 400 })
                } else {
                    reject({ error: e.message });
                }
            }
        })
    },

    approveClientRevisionController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { revision_id } = req.body;
                const user = await validateJWTToken(req, res);
                if (!mongoose.isValidObjectId(revision_id)) {
                    return resolve({ error: { error: "revision_id should be valid objectId" }, status: 400 })
                }
                const revisionDetails = await Rivision.findOne({ _id: revision_id });
                if (user.role !== "client_admin" && user.role !== "client_member") {
                    return resolve({ error: { error: "User should be client admin or client member." }, status: 400 });
                }
                const { modifiedCount } = await Rivision.updateOne({ _id: revision_id }, {
                    $set: {
                        rivision_status: "completed"
                    }
                });
                if (modifiedCount < 1) {
                    return resolve({ error: { error: "not updated. The revision id will be wrong" }, status: 400 });
                }
                const project = await Project.findOneAndUpdate({ _id: revisionDetails.project_id }, {
                    $set: {
                        project_status: "completed"
                    }
                })

                // notification
                const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + revisionDetails.project_id;
                projectStatusNotifnMail(revisionDetails.project_id, "completed", authUrl)
                projectNotification(revisionDetails.project_id, "completed", authUrl);

                // notification to client if there is download files
                if (project?.download?.length > 0) {
                    let path = "/projects/" + revisionDetails.project_id + "?tab=DOWNLOAD";
                    let authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + revisionDetails.project_id + "?tab=DOWNLOAD"
                    let message = `We've submitted your project files. Download Now`;
                    let htmlBody = notificationEmailTemplate(message, authUrl);
                    projectStatusNotifnMail(project._id, "completed", authUrl, "Download files are ready", htmlBody)
                    projectNotification(project?._id, "completed", path, message);
                }

                // notification for last revision resource for upload file
                const designer = await Rivision.aggregate([
                    {
                        $match: {
                            project_id: revisionDetails.project_id
                        }
                    },
                    {
                        $sort: {
                            revision_start_time: -1
                        }
                    },
                    {
                        $limit: 1
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "resource_id",
                            foreignField: "_id",
                            as: "resource"
                        }
                    },
                    {
                        $unwind: "$resource"
                    },
                    {
                        $replaceRoot: {
                            newRoot: "$resource"
                        }
                    }
                ])

                if (designer[0]) {
                    let path = "/projects/" + revisionDetails.project_id + "?tab=DOWNLOAD";
                    let authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + revisionDetails.project_id + "?tab=DOWNLOAD"
                    let htmlBody = notificationEmailTemplate("Revision approved. Please submit files.", authUrl);
                    triggerNotificationServer(designer[0]._id, `Revision approved. Please upload files.`, path);
                    sendNotifnMail(designer[0].email, "Please upload files", htmlBody);
                }
                // pusher
                await pusherServer.trigger(revisionDetails.project_id?.toString(), "project-update", {
                    action: "client_approved",
                    created: new Date()
                });
                resolve({ payload: { success: true, message: "Project completed successfully." }, status: 200 });
            } catch (e) {
                if (e.errors) {
                    resolve({ error: e.errors, status: 400 });
                } else {
                    reject({ error: e.message })
                }
            }
        })
    },

    declineClientRevisionController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { revision_id } = req.body;
                const user = await validateJWTToken(req, res);
                if (!mongoose.isValidObjectId(revision_id)) {
                    return resolve({ error: { error: "revision_id should be valid objectId" }, status: 400 })
                }
                const revisionDetails = await Rivision.findOne({ _id: revision_id });
                if (user.role !== "client_admin" && user.role !== "client_member") {
                    return resolve({ error: { error: "User should be client admin or client member." }, status: 400 });
                }
                const { modifiedCount } = await Rivision.updateOne({ _id: revision_id }, {
                    $set: {
                        rivision_status: "client_rejected"
                    }
                });
                if (modifiedCount < 1) {
                    return resolve({ error: { error: "not updated. The revision id will be wrong" }, status: 400 });
                }
                const project = await Project.findOneAndUpdate({ _id: revisionDetails.project_id }, {
                    $set: {
                        project_status: "in_progress"
                    }
                })


                const { project_manager, title } = project || {};
                const pm = await User.findOne({ _id: project_manager });
                const pmNtfnMsg = `Feedback received from ${user.first_name + " " + user.last_name}!`;
                const subject = "Alert..";
                let authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/revision/" + revision_id;
                const pmNotfHtml = notificationEmailTemplate(pmNtfnMsg, authUrl);
                const revisionPath = `/projects/revision/${revision_id}`;
                triggerNotificationServer(pm?._id, pmNtfnMsg, revisionPath);
                sendNotifnMail(pm?.email, subject, pmNotfHtml);

                // pusher
                await pusherServer.trigger(revisionDetails.project_id?.toString(), "project-update", {
                    action: "client_decliened",
                    created: new Date()
                });
                resolve({ payload: { success: true, message: "Client project rejected successfully." }, status: 200 });
            } catch (e) {
                if (e.errors) {
                    resolve({ error: e.errors, status: 400 });
                } else {
                    reject({ error: e.message });
                }
            }
        })
    },

    checkClientRejectedProjectController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { projectId, revisionId } = req.query;
                if (!projectId) {
                    return resolve({ error: { error: "projectId should need to pass as query." }, status: 400 });
                }
                if (!revisionId) {
                    return resolve({ error: { error: "revisionId should need to pass as query." }, status: 400 })
                }
                const revisionDetails = await Rivision.find({ project_id: projectId }).sort({ revision_start_time: -1 }).limit(1);
                if (!revisionDetails[0]) {
                    return resolve({ payload: { clientRejected: false }, status: 200 })
                }
                if (revisionDetails[0].rivision_status !== "client_rejected" && revisionDetails[0].rivision_status !== "client_commented") {
                    return resolve({ payload: { clientRejected: false }, status: 200 })
                }
                if (revisionDetails[0]._id.toString() !== revisionId) {
                    return resolve({ payload: { clientRejected: false }, status: 200 })
                }
                resolve({ payload: { clientRejected: true, resource_id: revisionDetails[0].resource_id }, status: 200 })
            } catch (e) {
                reject({ error: e.message });
            }
        })
    },

    holdRevisionCreDirController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await validateJWTToken(req, res);
                if (user.role !== "creative_director") {
                    return resolve({ error: { error: "Unathorized user." }, status: 401 })
                }
                const { revision_id } = req.query;
                if (!revision_id) {
                    return resolve({ error: { error: "revision_id required." }, status: 400 });
                }
                const revisionDetails = await Rivision.findOne({ _id: revision_id });
                await Rivision.updateOne({ _id: revision_id }, {
                    $set: {
                        rivision_status: "on_hold"
                    }
                })
                await Project.updateOne({ _id: revisionDetails.project_id }, {
                    $set: {
                        project_status: "on_hold",
                        update_date: new Date()
                    }
                })

                // notification
                // const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + revisionDetails.project_id;
                // projectStatusNotifnMail(revisionDetails.project_id, "on_hold", authUrl)
                // projectNotification(revisionDetails.project_id, "on_hold", authUrl);

                // pusher
                await pusherServer.trigger(revisionDetails.project_id?.toString(), "project-update", {
                    action: "creative director hold revision",
                    created: new Date()
                });
                resolve({ payload: { success: true, message: "revision holded successfully" }, status: 200 });
            } catch (e) {
                reject({ error: e.message });
            }
        })
    },

    unHoldRevisionCreDirController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await validateJWTToken(req, res);
                if (user.role !== "creative_director") {
                    return resolve({ error: { error: "Unathorized user." }, status: 401 })
                }
                const { revision_id } = req.query;
                if (!revision_id) {
                    return resolve({ error: { error: "revision_id required." }, status: 400 });
                }
                const revisionDetails = await Rivision.findOne({ _id: revision_id });
                await Rivision.updateOne({ _id: revision_id }, {
                    $set: {
                        rivision_status: "u_review"
                    }
                })
                await Project.updateOne({ _id: revisionDetails.project_id }, {
                    $set: {
                        project_status: "u_review",
                        update_date: new Date()
                    }
                })

                // notification
                // const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/projects/" + revisionDetails.project_id;
                // let message = "The creative director unhold your revision. It will reviewed and submited soon";
                // projectStatusNotifnMail(revisionDetails.project_id, "u_review", authUrl)
                // projectNotification(revisionDetails.project_id, "u_review", authUrl, message);

                // pusher
                await pusherServer.trigger(revisionDetails.project_id?.toString(), "project-update", {
                    action: "creative director un hold revision",
                    created: new Date()
                });
                resolve({ payload: { success: true, message: "revision un-holded successfully" }, status: 200 });
            } catch (e) {
                reject({ error: e.message })
            }
        })
    },


    deleteCommentController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                await validateJWTToken(req, res);
                const { mark_id, revision_id } = req.query;
                await Rivision.updateOne({ _id: revision_id }, {
                    $pull: {
                        comments: {
                            _id: mark_id
                        }
                    }
                });
                resolve({ payload: {}, status: 200 });
            } catch (e) {
                reject({ error: e.message })
            }
        })
    },

    deleteRevisionFileController: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { revision_id } = req.body;
                const user = await validateJWTToken(req, res);
                const revision = await Rivision.findOne({ _id: revision_id });

                if (user._id.toString() !== revision.resource_id.toString()) return resolve({ error: { error: "No access to delete file" }, status: 400 });
                await Rivision.updateOne({ _id: revision_id }, {
                    $set: {
                        rivision_status: "in_progress"
                    },
                    $unset: {
                        rivision_file: 1,
                        end_time: 1
                    }
                })
                await Project.updateOne({ _id: revision.project_id },
                    {
                        $set: {
                            project_status: "in_progress",
                            resource: user._id,
                            update_date: new Date()
                        }
                    })

                resolve({ payload: {}, status: 200 })
            } catch (e) {
                reject({ error: e.message });
            }
        })
    }
}


export default controllers;