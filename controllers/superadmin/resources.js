import User from "../../models/users";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Account from "../../models/accounts";
import resourceServices from "../../server/services/resource.services";
import CustomError from "../../server/lib/customError.lib";

export const createResource = async function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            let { role, skills } = req.body;

            if (role === "designer" && skills.length < 1) return resolve({ error: "Desinger must have skill!", status: 400 });
            if (!(skills instanceof Array)) return resolve({ error: "Skills should be array", status: 400 });

            const { data: resource } = await resourceServices.createResource({ ...req.body });

            // assigning project managers to existing client with no account manager
            const isNoAccountManagerExists = await Account.exists({ account_manager: { $exists: false } });

            if (isNoAccountManagerExists && role === "project_manager") await resourceServices.assignPMToResoure({ resource });


            resolve({ payload: resource, status: 200 });

        } catch (e) {
            reject(e);
        }
    })
}

export const listResources = async function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {

            const userId = req.query.params[1];
            const { data, status } = await resourceServices.listResources({ ...req.query, userId });
            if (userId) {
                return resolve({ payload: data, status });
            }
            resolve({ payload: { resources: data.resources, totalItems: data.total }, status: 200 });
        } catch (e) {
            reject(e);
        }
    })
}

export const deleteUser = async function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = req.query?.params[1];

            if (!userId) {
                return resolve({ error: "UserId must need to pass as parameter. /su-admin/resources/{{userId}}", status: 400 })
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return resolve({ error: "Invalid Id", status: 400 });
            }

            const existsInAccounts = await Account.findOne({ account_manager: userId });

            if (existsInAccounts) return resolve({ status: 400, error: "The project manager already assigned to some users. You can't delete!" })

            const { deletedCount } = await User.deleteOne({ _id: userId });

            if (deletedCount > 0) {
                resolve({ payload: { deleted: true, count: deletedCount }, status: 200 });
            } else {
                resolve({ status: 400, error: "No data found to delete!" })
            }

        } catch (e) {
            reject({ error: "Internal Server Error!", status: 500 });
        }
    })
}

export const editUser = async function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = req.query?.params[1];

            if (!userId) {
                return resolve({ error: "UserId must need to pass as parameter. /su-admin/resources/{{userId}}", status: 400 })
            }
            const { first_name, last_name, email, password, mobile_number, role, skills = [] } = req.body;

            const user = await User.findOne({ _id: userId });

            let exisitngMobile = null;
            let existingEmail = null;
            if (user.email !== email) {
                existingEmail = await User.findOne({ email });
            }
            if (user.mobile_number !== mobile_number) {
                exisitngMobile = await User.findOne({ mobile_number });
            }
            if (existingEmail) {
                return reject({ error: "Email already registered", status: 400 });
            }
            if (exisitngMobile) {
                return reject({ error: "Mobile number already registered", status: 400 });
            }


            if (!(skills instanceof Array)) return resolve({ error: "Skills should be array", status: 400 })

            let skillArray = [];
            if (skills) {
                skillArray = skills.map((skill) => ({ id: mongoose.Types.ObjectId(skill._id) }))
            }
            let hashPassword
            if (password) {

                hashPassword = bcrypt.hashSync(password.toString().trim(), 10);

            }

            const { modifiedCount } = await User.updateOne({ _id: userId }, {
                $set: {
                    first_name, last_name, role, email, mobile_number, skills: skillArray, password: hashPassword
                }
            })

            // assigning project managers to existing client with no account manager
            const isNoAccountManagerExists = await Account.exists({ account_manager: { $exists: false } });
            if (isNoAccountManagerExists && role === "project_manager") {
                await Account.updateOne({ account_manager: { $exists: false } }, {
                    $set: {
                        account_manager: userId
                    }
                })
            }

            if (modifiedCount > 0) {
                resolve({ payload: { updated: true, modifiedCount }, status: 200 });
            } else {
                resolve({ error: "Not Updated!", status: 204 });
            }

        } catch (e) {
            reject({ error: "Internal Server Error!" });
        }
    })
}
