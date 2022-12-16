import CustomError from "../lib/customError.lib"
import Account from "../../models/accounts";
import User from "../../models/users";
import Project from "../../models/projects";
import bcryptUtils from "../utils/bcrypt.utils";
import mongoose from "mongoose";
import convertToType from "../../helpers/typeConvert";

const createResource = async (params) => {
    try {
        let { first_name, last_name, email, password, mobile_number, role, skills = [] } = params;

        let existingEmail = await User.findOne({ email })
        let exisitngMobile = null;

        if (mobile_number) exisitngMobile = await User.findOne({ mobile_number: mobile_number });
        if (existingEmail) throw new CustomError("The email already registerd!", 400);
        if (exisitngMobile) throw new CustomError("The mobile number already registerd!", 400);

        let hashPassword = await bcryptUtils.createHashPassword(password, 10);
        let skillArray = [];

        if (skills) skillArray = skills.map((skill) => ({ id: mongoose.Types.ObjectId(skill._id) }))

        const resource = await User.create({
            first_name,
            last_name,
            email,
            password: hashPassword,
            role,
            skills: skillArray,
            mobile_number
        })
        return {
            data: resource,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const assignPMToResoure = async (params) => {
    try {
        const { resource, account_id } = params;
        if (!resource) throw new CustomError("PM not found", 400);

        let account = null;
        if (account_id) {
            account = await Account.findOneAndUpdate({ _id: account_id }, {
                $set: {
                    account_manager: resource._id
                }
            })
        } else {
            account = await Account.findOneAndUpdate({ account_manager: { $exists: false } }, {
                $set: {
                    account_manager: resource._id
                }
            })
        }
        await Project.updateMany({ account_id: account?._id },
            {
                $set: {
                    project_manager: resource._id
                }
            })
        return {
            data: {},
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const listResources = async (params) => {
    try {
        const { userId } = params;
        let { page, limit } = params;
        if (userId) {
            const resource = await User.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup:
                    {
                        from: "skills",
                        localField: "skills.id",
                        foreignField: "_id",
                        as: "skills"
                    }
                }
            ]);
            return {
                data: resource[0],
                status: !resource[0] ? 204 : 200
            }
        }
        if (!convertToType(page)) {
            page = 1;
        }
        if (!convertToType(limit)) {
            limit = 10;
        }

        const resources = await User.find({
            $and: [
                { role: { $ne: "client_admin" } },
                { role: { $ne: "client_member" } },
                { role: { $ne: "super_admin" } },
            ]
        }).skip((page * limit) - limit).limit(limit);
        const totalItems = await User.find({
            $and: [
                { role: { $ne: "client_admin" } },
                { role: { $ne: "client_member" } },
                { role: { $ne: "super_admin" } },
            ]
        }).count();

        return {
            data: { resources, total: totalItems },
            status: !resources[0] ? 204 : 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const listProjectManagers = async (params) => {
    try {
        let { page = 1, limit = 10 } = params;
        let aggregateQuery = [
            {
                $match: {
                    role: "project_manager"
                }
            }
        ];
        const pms = await User.aggregate([
            ...aggregateQuery,
            {
                $skip: (page * limit) - limit
            },
            {
                $limit: limit
            }
        ]);
        const pmCount = await User.aggregate([
            ...aggregateQuery,
            {
                $count: "total"
            }
        ])
        return {
            data: { pms, total: pmCount[0]?.total },
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const resourceService = {
    createResource,
    assignPMToResoure,
    listResources,
    listProjectManagers
}

export default resourceService;