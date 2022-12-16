import mongoose from "mongoose";
import convertToType from "../../helpers/typeConvert";
import Projects from "../../models/projects";
import CustomError from "../lib/customError.lib";

const listAllProjects = async (params) => {
    try {
        let { account_id, role, project_manager, search, status, from, to, page, limit, fileSort = 1 } = params;
        fileSort = Number(fileSort)

        console.log(from, to);
        let isClient = false;
        if (role === "client_admin" || role === "client_member") isClient = true;
        if (isClient && !account_id && !project_manager) throw new CustomError("missing fields")

        if (!status) {
            status = 'all';
        }
        if (!convertToType(page)) {
            page = 1;
        }
        if (!convertToType(limit)) {
            limit = 10;
        }

        let fileSortQuery = {
            $sort: {
                // [role=="project_manager"?'priority':'create_date']: role=="project_manager"?1:-1,
                create_date: -1
            }
        }



        if (["client_admin", "client_member"].includes(role) && fileSort === -1) {

            fileSortQuery = {
                $sort: {

                    // priority: 1,
                    "input.updatedAt": fileSort
                }
            }

        }
        if (["project_manager", "designer", "creative_director"].includes(role) && fileSort === -1) {
            fileSortQuery = {
                $sort: {
                    // priority: 1,
                    "download.updatedAt": fileSort
                }
            }
        }


        let aggregateSearchQuery = [
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand_id',
                    foreignField: '_id',
                    as: 'brand',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'resource',
                    foreignField: '_id',
                    as: 'resource',
                },
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
                    path: "$resource",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$pm",
                    preserveNullAndEmptyArrays: true
                }
            }
        ];

        if (project_manager || account_id) {
            aggregateSearchQuery = [...aggregateSearchQuery,
            {
                $match: {
                    [account_id ? 'account_id' : 'project_manager']: account_id
                        ? mongoose.Types.ObjectId(account_id)
                        : mongoose.Types.ObjectId(project_manager),
                },
            },
            ]
        }

        if (project_manager) {
            aggregateSearchQuery = [...aggregateSearchQuery,
            {
                $lookup: {
                    from: "accounts",
                    localField: "account_id",
                    foreignField: "_id",
                    as: "account_details"
                }
            },
            {
                $unwind: "$account_details"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "account_details.client_admin",
                    foreignField: "_id",
                    as: "client_admin"
                }
            },
            {
                $unwind: "$client_admin"
            }
            ]
        }
        // adding match query for project stautus
        if (status === 'on_going') {
            aggregateSearchQuery = [
                ...aggregateSearchQuery,
                {
                    $match: {
                        $and: [
                            { project_status: { $ne: 'completed' } },
                            { project_status: { $ne: 'cancelled' } }
                        ],
                    },
                },
            ];
        } else if (status === 'completed') {
            aggregateSearchQuery = [
                ...aggregateSearchQuery,
                {
                    $match: {
                        project_status: 'completed',
                    },
                },
            ];
        } else if (status === 'all') {
            aggregateSearchQuery = [...aggregateSearchQuery];
        } else if (status === "in_progress") {
            aggregateSearchQuery = [
                ...aggregateSearchQuery,
                {
                    $match: {
                        $or: [
                            { project_status: { $eq: 'in_progress' } },
                            { project_status: { $eq: 'u_review' } },
                            { project_status: { $eq: 'u_approval' } },
                            { project_status: { $eq: 'on_hold' } },
                            { project_status: { $eq: 'to_be_confirmed' } },
                        ],
                    },
                },
            ];
        } else {
            aggregateSearchQuery = [
                ...aggregateSearchQuery,
                {
                    $match: {
                        project_status: status,
                    },
                },
            ];
        }

        // adding match query for filter by date (from, to)
        if (from) {
            let fromDate = new Date(from);
            let toDate = to ? new Date(to) : new Date();
            fromDate.setHours(0, 0, 0);
            toDate.setHours(24, 0, 0);

            aggregateSearchQuery = [
                ...aggregateSearchQuery,
                {
                    $match: {
                        create_date: {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                }
            ];
        }
        // adding match query for search text
        if (search) {
            aggregateSearchQuery = [
                ...aggregateSearchQuery,
                {
                    $match: {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { project_type: { $regex: search, $options: 'i' } },
                            { 'brand.name': { $regex: search, $options: 'i' } },
                            { 'project_index': parseInt(search) },
                            { "client_admin.email": { $regex: search, $options: 'i' } },
                        ],
                    },
                },
            ];
        }

        // making date data 0, so user can't see when fetch it
        aggregateSearchQuery = [
            ...aggregateSearchQuery,
            { $project: { date: 0, brand_id: 0 } },
            fileSortQuery
        ];
        // db aggregation
        const response = await Projects.aggregate([
            ...aggregateSearchQuery,
            {
                $skip: (parseInt(page) * parseInt(limit)) - parseInt(limit)
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        const count = await Projects.aggregate([
            ...aggregateSearchQuery,
            {
                $count: "total"
            }
        ])

        return {
            data: { project: response, total: count[0]?.total },
            status: !response[0] ? 204 : 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const listOneProject = async (params) => {
    try {
        const { account_id, last } = params;
        let project
        if (last) {
            project = await Projects.findOne({ account_id }).sort({ project_index: -1 });
        } else {
            project = await Projects.findOne({ account_id: account_id })
        }
        return {
            data: project,
            status: !project ? 204 : 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const getProjectById = async (params) => {
    try {
        const { projectId, showAccount, showProjectManager, showClientAdmin, showClientMembers, showResources, } = params;
        let query = [
            {
                $match: {
                    _id: mongoose.Types.ObjectId(projectId)
                }
            },
        ]
        if (showAccount) {
            query = [...query,
            {
                $lookup: {
                    from: "accounts",
                    localField: "account_id",
                    foreignField: "_id",
                    as: "account_details"
                }
            },
            {
                $unwind: "$account_details"
            }
            ]
        }
        if (showProjectManager) {
            query = [...query,
            {
                $lookup: {
                    from: "users",
                    localField: "project_manager",
                    foreignField: "_id",
                    as: "project_manager"
                }
            },
            {
                $unwind: {
                    path: "$project_manager",
                    preserveNullAndEmptyArrays: true
                }
            },
            ]
        }
        if (showClientAdmin) {
            query = [...query,
            {
                $lookup: {
                    from: "users",
                    localField: "account_details.client_admin",
                    foreignField: "_id",
                    as: "client_admin"
                }
            },
            {
                $unwind: "$client_admin"
            },
            ]
        }
        if (showClientMembers) {
            query = [...query,
            {
                $lookup: {
                    from: "users",
                    localField: "account_details.client_members.userId",
                    foreignField: "_id",
                    as: "client_members"
                }
            },
            {
                $unwind: "$client_admin"
            },
            ]
        }
        if (showResources) {
            query = [...query,

            {
                $lookup: {
                    from: "users",
                    localField: "resource",
                    foreignField: "_id",
                    as: "resource"
                }
            },
            {
                $unwind: {
                    path: "$resource",
                    preserveNullAndEmptyArrays: true
                }
            },
            ]
        }
        const projectDetails = await Projects.aggregate([...query]);

        return {
            data: projectDetails,
            status: !projectDetails[0] ? 204 : 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const createProject = async (params) => {
    try {
        let { title, project_type, category, size, message, files, lastProject, project_manager, account_id } = params;
        const createProjects = await Projects.create({
            account_id,
            title,
            project_type,
            category,
            size,
            project_manager,
            message,
            project_index: !lastProject ? 1 : lastProject.project_index + 1,
            priority: !lastProject ? 1 : lastProject.project_index + 1,
            create_date: new Date(),
            update_date: new Date()
        });

        return {
            data: createProjects,
            status: 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const updateProject = async (params) => {
    try {
        const { project_id, project_index, priority, account_id, title, create_date, update_date, estimate_date, project_type, resource, category, size, project_manager, project_status, brand_id, message, project_prev_status, input = [], download = [] } = params;
        const project = await Projects.findOneAndUpdate({ _id: project_id }, {
            $set: {
                project_index,
                priority,
                account_id,
                title,
                create_date,
                update_date,
                estimate_date,
                project_type,
                resource,
                category,
                size,
                project_manager,
                project_status,
                brand_id,
                message,
                project_prev_status
            },
            $push: {
                input: { $each: input },
                download: { $each: download }
            }
        })

        return {
            data: project,
            status: 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const listProjectsForCR = async (params) => {
    try {
        let { page, limit, search, status, from, to } = params;
        let aggregateQuery = [
            {
                $lookup: {
                    from: "accounts",
                    localField: "account_id",
                    foreignField: "_id",
                    as: "account_details"
                }
            },
            {
                $unwind: "$account_details"
            },
            {
                $lookup: {
                    from: "plans",
                    localField: "account_details.active_plan.plan_id",
                    foreignField: "_id",
                    as: "plan_details"
                }
            },
            {
                $unwind: "$plan_details"
            },
            {
                $match: {
                    "plan_details.has_creative_director": true
                }
            },
            {
                $project: {
                    account_details: 0, plan_details: 0
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand_id',
                    foreignField: '_id',
                    as: 'brand',
                },
            },
        ]
        if (!convertToType(page)) {
            page = 1;
        }
        if (!convertToType(limit)) {
            limit = 5;
        }
        if (convertToType(search)) {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    $match: {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { project_type: { $regex: search, $options: 'i' } },
                            { 'brand.name': { $regex: search, $options: 'i' } },
                            { 'project_index': parseInt(search) },
                        ],
                    },
                },
            ]
        }
        if (!isNaN(new Date(from))) {
            let fromDate = new Date(from);
            let toDate = convertToType(to) ? new Date(to) : new Date();
            fromDate.setHours(0, 0, 0);
            toDate.setHours(24, 0, 0);

            aggregateQuery = [
                ...aggregateQuery,
                {
                    $match: {
                        create_date: {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                }
            ];
        }
        if (status === 'on_going') {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    $match: {
                        $and: [
                            { project_status: { $ne: 'completed' } },
                            { project_status: { $ne: 'cancelled' } }
                        ],
                    },
                },
            ];
        } else if (status === 'completed') {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    $match: {
                        project_status: 'completed',
                    },
                },
            ];
        } else if (status === 'all') {
            aggregateQuery = [...aggregateQuery];
        } else {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    $match: {
                        project_status: status,
                    },
                },
            ];
        }
        const projects = await Projects.aggregate([
            ...aggregateQuery,
            {
                $sort: {
                    create_date: -1
                }
            },
            {
                $skip: (parseInt(page) * parseInt(limit)) - parseInt(limit)
            },
            {
                $limit: parseInt(limit)
            }
        ]);
        const totalProjects = await Projects.aggregate([
            ...aggregateQuery,
            {
                $count: "total"
            }
        ])

        return {
            data: { projects, total: totalProjects[0]?.total },
            status: !projects[0]?204:200
        }
    } catch (e) {
        throw CustomError(e.errors || e.message, 400);
    }
}

const projectService = {
    listAllProjects,
    listProjectsForCR,
    listOneProject,
    getProjectById,
    createProject,
    updateProject
}

export default projectService;