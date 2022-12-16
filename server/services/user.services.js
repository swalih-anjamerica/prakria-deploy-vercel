import mongoose from "mongoose";
import convertToType from "../../helpers/typeConvert";
import User from "../../models/users";
import CustomError from "../lib/customError.lib";



const createUser = async (params) => {
    let user = {};
    try {
        const { first_name, last_name, email, role = "client_admin", hashPassword, designation, subscription_status, is_verified } = params;

        const isExist = await User.exists({ email });
        if (isExist) throw new CustomError("Email already registered", 400);

        user = await User.create({
            first_name,
            last_name,
            email,
            password: hashPassword,
            role: role,
            designation,
            is_verified
        })


        return {
            data: user,
            status: 200
        }
    } catch (e) {
        await User.deleteOne({ _id: user?._id });
        throw new CustomError(e.errors || e.message);
    }
}

const findUserById = async (req) => {
    const { id } = req.query;
    const user = await User.findOne({ _id: id }).lean();
    return { data: user, status: 200 };
}

const findUserByEmail = async (req) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    return { data: user, status: 200 };
}

const findUserByIdV2 = async (params) => {
    try {
        const { id } = params;
        const user = await User.findOne({ _id: id });
        return { data: user, status: 200 }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const updateUser = async (params) => {
    try {
        const { user_id, first_name, last_name, email, hashPassword, mobile_number, role, available, designation, skills = [], is_verified, time_zone, payment_completed, settings } = params;
        const updateUser = await User.findOneAndUpdate({ _id: user_id },
            {
                $set: {
                    first_name,
                    last_name,
                    email,
                    password: hashPassword,
                    mobile_number,
                    role,
                    available,
                    designation,
                    is_verified,
                    time_zone,
                    payment_completed,
                    settings
                },
                $push: {
                    skills: { $each: skills }
                }
            }
        )

        return { data: updateUser }
    } catch (e) {
        // return {
        //     error: e.errors || e.message,
        //     status: 400
        // }
        throw new CustomError(e.errors || e.message, 400);
    }
}

const listAllUsers = async (params) => {
    try {
        let { limit, page, search_text, showClientAdminOnly = true } = params;
        if (!convertToType(limit)) limit = 10;
        if (!convertToType(page)) page = 1;
        if (!convertToType(search_text)) search_text = "";

        let aggregateQuery = [];

        if (showClientAdminOnly) {
            aggregateQuery = [...aggregateQuery,
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { role: { $eq: "client_admin" } },
                                // { role: { $eq: "client_member" } },
                            ]
                        },
                        {
                            $or: [
                                { first_name: { $regex: search_text, $options: "i" } },
                                { last_name: { $regex: search_text, $options: "i" } },
                                { email: { $regex: search_text, $options: "i" } },
                            ]
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "client_admin",
                    as: "account"
                }
            },
            {
                $unwind: {
                    path: "$account",
                    preserveNullAndEmptyArrays: true
                }
            }
            ]
        } else {
            aggregateQuery = [
                ...aggregateQuery,
                {
                    $match: {
                        $or: [
                            { first_name: { $regex: search_text, $options: "i" } },
                            { last_name: { $regex: search_text, $options: "i" } },
                            { email: { $regex: search_text, $options: "i" } },
                        ]
                    }
                }
            ]
        }

        const userDetails = await User.aggregate([
            ...aggregateQuery,
            {
                $skip: (parseInt(page) * parseInt(limit)) - parseInt(limit)
            },
            {
                $limit: parseInt(limit)
            }
        ]);
        const userCount = await User.aggregate([
            ...aggregateQuery,
            {
                $count: "total"
            }])
        return {
            data: { user: userDetails, total: userCount[0]?.total },
            status: !userDetails[0] ? 204 : 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const getOneClient = async (params) => {
    try {
        const { userId } = params;
        let aggregateQuery = [
            {
                $match: {
                    _id: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "client_admin",
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
                $unwind: {
                    path: "$plan_details",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "account_details.account_manager",
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

        ];
        const userDetails = await User.aggregate(aggregateQuery);
        return {
            data: userDetails[0],
            status: !userDetails[0] ? 204 : 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const listDesigners = async (params) => {
    try {
        let { page = 1, limit = 1, search_text, skill_type } = params;

        if (!convertToType(page)) page = 1;
        if (!convertToType(limit)) limit = 10;

        page = parseInt(page);
        limit = parseInt(limit);

        let aggregateQuery = [
            {
                $match: {
                    role: "designer"
                }
            },
            {
                $lookup: {
                    from: "skills",
                    localField: "skills.id",
                    foreignField: "_id",
                    as: "skills"
                }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "resource",
                    as: "project_details"
                }
            }
        ]

        // search with text for firstname,lastname and email
        if (convertToType(search_text)) {
            aggregateQuery = [...aggregateQuery,
            {
                $match: {
                    $or: [
                        { first_name: { $regex: search_text, $options: "i" } },
                        { last_name: { $regex: search_text, $options: "i" } },
                        { email: { $regex: search_text, $options: "i" } }
                    ]
                }
            }]
        }

        if (convertToType(skill_type)) {
            aggregateQuery = [...aggregateQuery,
            {
                $match: {
                    "skills._id": mongoose.Types.ObjectId(skill_type)
                }
            }]
        }

        // initial querys 
        aggregateQuery = [...aggregateQuery,
        {
            $sort: {
                project_details: 1
            }
        },
        {
            $skip: (page * limit) - limit
        },
        {
            $limit: limit
        }
        ]

        const allResources = await User.aggregate(aggregateQuery);
        return {
            data: allResources,
            status: !allResources[0] ? 204 : 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const userService = {
    createUser,
    findUserById,
    findUserByEmail,
    findUserByIdV2,
    updateUser,
    listAllUsers,
    getOneClient,
    listDesigners
}

export default userService;