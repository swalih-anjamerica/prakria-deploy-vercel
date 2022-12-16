import mongoose from "mongoose";
import Account from "../../models/accounts";
import CustomError from "../lib/customError.lib";

const findAccountFromUser = async (req) => {
    try {
        const user = req.user;
        const id = req.query.id;
        const accountDetails = await Account.findOne({
            [user.role === "client_admin" ? "client_admin" : user.role === "client_member" ? "client_members.userId" : user.role === "project_manager" ? "account_manager" : ""]: id
        })
        return { data: accountDetails, status: 200 };
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400)
    }
}

const findAccount = async (params) => {
    try {
        const { client_id: client_admin, account_id: _id, showActivePlan, query } = params;
        let accountDetails = {};

        if (showActivePlan) {
            accountDetails = await Account.findOne({ _id }).populate("active_plan.plan_id");
        }
        else if (query) {
            accountDetails = await Account.findOne(query);
        }
        else {
            accountDetails = await Account.findOne({ client_admin });
        }
        return { data: accountDetails, status: 200 };
    } catch (e) {
        return { error: e.errors || e.message, status: 400 }
    }
}

const updateAccount = async (params) => {
    try {
        const { stripe_customer_id, client_admin, company_address, active_plan, plan_history = [], added_resources = [], added_resources_history = [], account_manager, client_members = [], account_id } = params;
        let findQuery = {};
        if (account_id) {
            findQuery = { _id: account_id }
        }
        else if (client_admin) {
            findQuery = { client_admin: client_admin }
        }
        const update = await Account.updateOne(findQuery, {
            $set: {
                stripe_customer_id,
                client_admin,
                company_address,
                account_manager,
                active_plan
            },
            $push: {
                plan_history: { $each: plan_history },
                added_resources: { $each: added_resources },
                added_resources_history: { $each: added_resources_history },
                client_members: { $each: client_members }
            }
        })

        return { data: update, status: 200 };
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const getPlanDetails = async (params) => {
    try {
        const { userDetails } = params;
        const aggregateQuery = [
            {
                $match: {
                    [userDetails.role === "client_admin" ? "client_admin" : "client_members.userId"]: mongoose.Types.ObjectId(userDetails._id)
                }
            },
            {
                $lookup: {
                    from: "plans",
                    localField: "active_plan.plan_id",
                    foreignField: "_id",
                    as: "plan_details"
                }
            },
            {
                $lookup: {
                    from: "skills",
                    localField: "added_resources.skill_id",
                    foreignField: "_id",
                    as: "resources"
                }
            },
            {
                $unwind: "$plan_details"
            },
            {
                $project: {
                    stripe_customer_id: 1, client_admin: 1, active_plan: 1, plan_details: 1, resources: 1, added_resources: 1
                }
            }
        ]
        const accountDetails = await Account.aggregate(aggregateQuery);

        return {
            data: accountDetails[0],
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const findBrandsFromAccount = async (params) => {
    try {
        const { name="", projectMan, sort } = params;

        const brands = await Account.aggregate([
            {
                $match: {
                    account_manager: mongoose.Types.ObjectId(projectMan)
                }
            },
            {
                $lookup: {
                    from: "brands",
                    foreignField: "account_id",
                    localField: "_id",
                    as: "brands"
                }
            },
            {
                $unwind: "$brands"
            },
            {
                $replaceRoot: {
                    newRoot: "$brands"
                }
            },
            {
                $match: {
                    name: { $regex: name, $options: "i" }
                }
            },
            {
                $sort:{
                    updatedAt:parseInt(sort)
                }
            }
        ])

        return {
            data: brands,
            status: 200
        }
    } catch (e) {
        console.log(e);
        throw new CustomError(e.errors || e.message, 400);
    }
}

const accountService = {
    findAccountFromUser,
    findBrandsFromAccount,
    findAccount,
    updateAccount,
    getPlanDetails
}
export default accountService;