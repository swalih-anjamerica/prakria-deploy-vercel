import { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/users";
import Account from "../../models/accounts"
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import AuthToken from "../../models/auth_tokens";
import crypto, { randomUUID } from "node:crypto"
import Payment from "../../models/payments";
import validator from "validator";
import { validateJWTToken } from "../../middlewares/userJWTAuth";
import Skill from "../../models/skills";
import { sendNotifnMail, triggerNotificationServer } from "../../helpers/notificationHelper";
import Plan from "../../models/plans";
import mailTransport from "../../lib/nodemailerTransport";
import { addMemberHtmlFile, clientVerificationHtmlFile, forgotPasswordHtmlFile, notificationEmailTemplate } from "../../helpers/mailHtmlFiles";
import convertType from "../../helpers/typeConvert";
import stripe from "../../lib/stripe";
import xeroHelper from "../../helpers/xero.helper";
import accountService from "../../server/services/account.services";
import userService from "../../server/services/user.services";
import authTokenSevice from "../../server/services/authToken.services";
import mailUtils from "../../server/utils/mail.utils";
import accountValidations from "../../server/validations/account.validations";
import bcryptUtils from "../../server/utils/bcrypt.utils";


const doUserSignup = (req, res) => {
    return new Promise(async (resolve, reject) => {
        const { user_id, stripeData } = req.body;
        try {
            // create user
            if (!stripeData) {
                return resolve({ error: { error: "stripe data required" }, status: 400 });
            }
            const accountDetails = await Account.findOne({ client_admin: user_id });
            const createUser = await User.findOneAndUpdate({ _id: user_id }, {
                payment_completed: true
            })
            // creating payment history
            await Payment.create({
                paid_date: new Date(stripeData.stripe_paid_date * 1000),
                paid_amount: stripeData.stripe_amount,
                paid_currency: stripeData.stripe_currency,
                paid_type: "init_subscription",
                plan_duration: accountDetails?.active_plan?.duration,
                account_id: accountDetails?._id,
                plan_id: accountDetails?.active_plan?.plan_id,
                stripe_payment_id: stripeData.stripe_payment_id,
                stripe_payment_secret: stripeData.stripe_client_secret,
                stripe_payment_method_id: stripeData.stripe_payment_method_id
            })
            // xero
            const xeroBody = {
                invoiceId: stripeData.stripe_payment_id,
            }
            await xeroHelper.markInvoiceAsPaid(xeroBody);

            const planDetails = await Plan.findOne({ _id: accountDetails?.active_plan?.plan_id });

            // json token
            const token = jsonwebtoken.sign({ id: createUser._id }, process.env.JSON_SECRET);

            // email notification
            let subject = "Congragulations!!";
            let htmlBody = notificationEmailTemplate(`Congratulations! You have started your journey with ${planDetails.title}. Let's do some great work together...`)
            await sendNotifnMail(createUser.email, subject, htmlBody);

            // notification
            let receiver_id = createUser._id;
            let message = `Congratulations! You have started your journey with ${planDetails.title}. Let's do some great work together...`;
            let path = "/account?tab=plan";
            await triggerNotificationServer(receiver_id, message, path).catch(err => console.log(err));
            message = `Your email is not verified yet!. Please verify your email and continue`;
            await triggerNotificationServer(receiver_id, message).catch(err => console.log(err));

            resolve({ payload: { success: true, message: "Account created.", token: token }, status: 200 })
        } catch (e) {
            if (e.errors) {
                resolve({ error: e.errors, status: 400 });
            } else {
                reject({ error: e.message })
            }
        }
    })
}

const addNewMember = (req, res) => {
    return new Promise(async (resolve, reject) => {
        let createUser;
        try {
            const { client_id, first_name, email } = req.body;
            const { data: validationError } = await accountValidations.addNewMemberValidation(req);
            if (validationError) return { error: validationError, status: 400 }

            const { data: accountDetails } = await accountService.findAccount({ client_id });

            // checking the client members already five.
            if (accountDetails?.client_members?.length >= 5) return resolve({ error: { message: "Your limit is over. You cannot create members more than five." }, status: 400 });

            let { data: createUser } = await userService.createUser({ ...req.body, role: "client_member", subscription_status: "subscribed", is_verified: true })
            await accountService.updateAccount({
                client_admin:client_id,
                client_members: [{ userId: createUser._id }]
            })

            const {data:authHash}=await authTokenSevice.createAuthToken({
                value: ' ' + randomUUID(),
                client_member_id: createUser._id,
                client_admin_id: client_id
            })

            const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/signup/" + authHash.auth_token;
            await mailUtils.sendMail({
                email,
                subject: "Complete prakria account",
                text: `hi ${first_name}, please complete your prakria account`,
                html: addMemberHtmlFile(first_name, authUrl)
            })

            resolve({ payload: { success: true, message: "Message send!", user: createUser }, status: 200 })
        } catch (e) {
            reject(e);
        }
    })
}

const completeClientMemberSignup = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { client_admin_id, client_member_id, client_member_password, auth_token } = req.body;
            // validations


            const isClientAdminExist = await User.findOne({ _id: client_admin_id, role: "client_admin" });
            if (!isClientAdminExist) return resolve({ error: { error: `no client_admin exist on this objectId ${client_admin_id}` }, status: 400 });

            const isClientMemberExist = await User.exists({ _id: client_member_id, role: "client_member" });
            if (!isClientMemberExist) return resolve({ error: { error: `no client_member exist on this objectId ${client_admin_id}` }, status: 400 });

            const isClientMemberUnderAdmin = await Account.exists({ "client_members.userId": client_member_id, client_admin: client_admin_id })
            if (!isClientMemberUnderAdmin) return resolve({ error: { error: `This client_member_id '${client_member_id}' not exists in client_admin provided '${client_admin_id}'` }, status: 400 });

            // db 
            const hashPassword = await bcryptUtils.createHashPassword(client_member_password.toString(), 10);
            const {data:clientMemberDetails} = await userService.updateUser({
                hashPassword,
                user_id: client_member_id
            })

            await AuthToken.deleteOne({ auth_token });

            // email notification 
            const clientEmail = isClientAdminExist.settings?.email_notification ? isClientAdminExist.email : "";
            const subject = "Congragulations!!";
            const htmlBody = notificationEmailTemplate(`You have successfully added ${clientMemberDetails.first_name} to your team.`);
            sendNotifnMail(clientEmail, subject, htmlBody);

            // notification
            let receiver_id = isClientAdminExist._id;
            let message = `You have successfully added ${clientMemberDetails.first_name} to your team.`;
            let path = "/account?tab=company";
            triggerNotificationServer(receiver_id, message, path);

            resolve({ payload: { updated: true, message: "user updated successfully!" }, status: 200 })

        } catch (e) {
            reject(e);
        }
    })
}

const sendClientAdminVerificatinEmail = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { client_id } = req.body;
            if (!mongoose.isValidObjectId(client_id)) {
                return resolve({ error: { error: "client_id is not valid id" }, status: 400 });
            }
            const userDetails = await User.findOne({ _id: client_id, role: "client_admin" });
            if (!userDetails) {
                return resolve({ error: { error: "id is not a client admin id" }, status: 400 });
            }
            // const jwtHash = jsonwebtoken.sign({ client_member_id: createUser._id, client_admin_id: client_id }, process.env.JSON_SECRET, { expiresIn: "24h" })
            const authHash = crypto.createHmac("sha256", process.env.JSON_SECRET)
                .update(' ' + randomUUID())
                .digest("hex");


            await AuthToken.create({
                body: {
                    id: client_id
                },
                auth_token: authHash
            })

            const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/validate/" + authHash;

            let htmlFile = clientVerificationHtmlFile(authUrl);

            const response = await mailTransport.sendMail({
                to: userDetails.email,
                from: process.env.SEND_EMAIL_ID,
                subject: "Complete prakria account",
                text: `hi ${userDetails.first_name}, please complete your prakria account!`,
                html: htmlFile
            })

            resolve({ payload: { success: true, message: "Email validation Message send!" }, status: 200 })
        } catch (e) {
            if (e.errors) {
                resolve({ error: e.errors, status: 400 })
            } else {
                reject({ error: e.message })
            }
        }
    })
}

const verifyClientAdminEmail = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { auth_token } = req.body;
            const tokenDetails = await AuthToken.findOne({ auth_token: auth_token })
            if (!tokenDetails?.body?.id) {
                return resolve({ error: { error: "unathorized" }, status: 401 });
            }
            const { id: client_id } = tokenDetails?.body;
            const userDetails = await User.findOne({ _id: client_id, role: "client_admin" })
            if (!userDetails) {
                return resolve({ error: { error: "unathorized" }, status: 401 });
            }
            await User.updateOne({ _id: client_id }, {
                $set: {
                    is_verified: true
                }
            })
            await AuthToken.deleteOne({ auth_token });

            // notification
            let receiver_id = userDetails._id;
            let message = `Congragulations, You have verified your email successfully!`;
            let path = "/account?tab=account_details";
            await triggerNotificationServer(receiver_id, message, path).catch(err => console.log(err.message));

            // email notification
            const email = userDetails?.settings?.email_notification ? userDetails.email : "";
            const subject = "Verification succesfull";
            const htmlFile = notificationEmailTemplate(message, null, userDetails?.first_name);
            await sendNotifnMail(email, subject, htmlFile);

            resolve({ payload: { success: true, message: "Verification succesfull" }, status: 200 })
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
const getAccountDetails = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = req.headers.authorization;
            if (!token) return resolve({ status: 400, error: "No token here" });

            const ctoken = token.split(" ")[1];
            if (ctoken === "null") {
                return resolve({ payload: { logedin: false, user: {}, role: null }, status: 200 })
            }

            const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);

            const userDetails = await User.findOne({ _id: id });

            if (!userDetails) {
                return resolve({ status: 204 });
            }

            let accountData;
            if (userDetails.role === "client_admin") {
                accountData = await Account.findOne({ client_admin: id });
            } else {
                accountData = await Account.findOne({ "client_members.userId": id });
            }

            resolve({ payload: { account: accountData, user: userDetails }, status: 200 })

        } catch (e) {
            reject({ error: e });
        }
    })
}

const editAccountDetails = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = req.headers.authorization;
            if (!token) return resolve({ status: 400, error: "No token here" });

            const ctoken = token.split(" ")[1];
            if (ctoken === "null") {
                return resolve({ payload: { logedin: false, user: {}, role: null }, status: 200 })
            }

            let { schema } = req.query;

            if (!schema) {
                schema = "user";
            }

            const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);


            // updating user schema
            if (schema === "user") {

                const { first_name, last_name, email, mobile_number, designation, time_zone } = req.body

                if (mobile_number && !validator.isMobilePhone(mobile_number)) {
                    return resolve({ error: { error: "mobile_number should be valid number.", code: 400 }, status: 400 });
                }
                const userDetails = await User.findOne({ _id: id });
                if (userDetails.email !== email) {
                    const checkEmailExists = await User.exists({ email });
                    if (checkEmailExists) {
                        return resolve({ error: { error: "This email already registered." }, status: 400 });
                    }
                    await User.updateOne({ _id: id }, {
                        $set: {
                            is_verified: false
                        }
                    })
                }
                const { modifiedCount, matchedCount } = await User.updateOne({ _id: id }, {
                    $set: {
                        first_name,
                        last_name,
                        email,
                        mobile_number,
                        designation,
                        time_zone
                    }
                });

                if (modifiedCount < 1) {
                    resolve({ error: { success: false, message: "not updated" }, status: 400 })
                } else {
                    resolve({ payload: { success: true, message: "user updated successfully!", modifiedCount }, status: 200 });
                }

            }
            // updating company address
            else if (schema === "company") {
                const { company_name, address, pincode, city, state, country, website, taxcode, industry } = req.body;

                const { modifiedCount } = await Account.updateOne({ client_admin: id }, {
                    $set: {
                        "company_address.company_name": company_name,
                        "company_address.address": address,
                        "company_address.pincode": pincode,
                        "company_address.city": city,
                        "company_address.state": state,
                        "company_address.country": country,
                        "company_address.website": website,
                        "company_address.taxcode": taxcode,
                        "company_address.industry": industry,
                    }
                })


                if (modifiedCount < 1) {
                    resolve({ error: { success: false, message: "not updated" }, status: 400 })
                } else {
                    resolve({ payload: { success: true, message: "comapny address updated successfully!" }, status: 200 });
                }
            }
        } catch (e) {
            if (e.errors) {
                resolve({ error: e.errors, status: 400 })
            } else {
                reject({ error: e })
            }
        }
    })
}

const listClientMembers = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = req.headers.authorization;
            if (!token) return resolve({ status: 400, error: "No token here" });

            const ctoken = token.split(" ")[1];
            if (ctoken === "null") {
                return resolve({ payload: { logedin: false, user: {}, role: null }, status: 200 })
            }

            const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);

            const userDetails = await User.findOne({ _id: id });

            const aggregateQuery = [{
                $match: {
                    [userDetails.role === "client_admin" ? "client_admin" : "client_members.userId"]: mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "client_members.userId",
                    as: "client_members"
                }
            },
            {
                $project: {
                    client_admin: 1, client_members: 1
                }
            },
            {
                $limit: 5
            }]

            const memberList = await Account.aggregate(aggregateQuery);

            if (!memberList[0]?.client_members[0]) {
                return resolve({ status: 204 })
            }

            resolve({ payload: memberList[0], status: 200 })

        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const removeClientMember = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {

            const token = req.headers.authorization;
            if (!token) return resolve({ status: 400, error: "No token here" });

            const ctoken = token.split(" ")[1];
            if (ctoken === "null") {
                return resolve({ payload: { logedin: false, user: {}, role: null }, status: 200 })
            }

            const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);

            const userDetails = await User.findOne({ _id: id });

            if (userDetails?.role === "client_member") {
                return resolve({ error: { error: "Member have no access to delete another member.", code: 405 }, status: 405 });
            }

            const { client_member_id } = req.body;

            const deleteMemberFromUser = await User.deleteOne({ _id: client_member_id })

            const deleteMemberFromAccount = await Account.updateOne({ client_admin: id },
                {
                    $pull: {
                        client_members: { userId: client_member_id }
                    }
                })

            resolve({ payload: { message: "Client member deleted", success: true, code: 200 }, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}


const listAddResourceSkills = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            if (user.role !== "client_admin") {
                return resolve({ error: { error: "client admin can only do add resource" }, status: 400 });
            }
            const accountDetails = await Account.findOne({ client_admin: user._id });
            if (!accountDetails) {
                return resolve({ error: { error: "no account details found" }, status: 400 });
            }
            let { page, limit, search } = req.query;
            if (!convertType(page)) {
                page = 1;
            }
            if (!convertType(limit)) {
                limit = 5;
            }
            if (!convertType(search)) {
                search = "";
            }
            let notEqualSkills = []
            for (let i = 0; i < accountDetails?.added_resources.length; i++) {
                notEqualSkills.push(accountDetails?.added_resources[i].skill_id)
            }
            const skills = await Skill.find({
                _id: {
                    $nin: notEqualSkills
                },
                skill_name: { $regex: search, $options: "ig" }
            })
            // .skip((parseInt(page) * parseInt(limit)) - parseInt(limit)).limit(parseInt(limit));
            const skillCount = await Skill.find({
                _id: {
                    $nin: notEqualSkills
                },
                skill_name: { $regex: search, $options: "ig" }
            }).count();
            resolve({ payload: { skills, total: skillCount }, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const addResourceToClientController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            if (user.role !== "client_admin") {
                return resolve({ error: { error: "only client admin can add resource to account." }, status: 400 });
            }
            const { skill_id, duration, stripe_payment_id, paymentData } = req.body;
            if (!skill_id || !duration || !stripe_payment_id) {
                return resolve({ error: { error: "skill_id or duration or stripe_payment_id cann't be empty." }, status: 400 })
            }
            if (!paymentData) {
                return resolve({ error: "accountId required.", status: 400 });
            }
            let endDate;
            switch (duration) {
                case "7days":
                    endDate = new Date()
                    endDate.setDate(new Date().getDate() + 7)
                    break;
                case "14days":
                    endDate = new Date()
                    endDate.setDate(new Date().getDate() + 14)
                    break;
                case "30days":
                    endDate = new Date()
                    endDate.setDate(new Date().getDate() + 30)
                    break;
            }
            await Account.updateOne({ client_admin: user._id }, {
                $push: {
                    added_resources: {
                        skill_id,
                        duration,
                        stripe_payment_id,
                        end_date: endDate
                    }
                }
            })
            const accountDetails = await Account.findOne({ client_admin: user._id });
            // updating payment history
            await Payment.create({
                paid_date: new Date(),
                paid_amount: paymentData?.stripe_amount,
                paid_currency: paymentData?.stripe_currency,
                paid_type: "add_resource",
                account_id: accountDetails._id,
                resource_id: skill_id,
                resource_duration: duration,
                stripe_payment_id: paymentData?.stripe_payment_id,
                stripe_payment_secret: paymentData?.stripe_client_secret,
                stripe_payment_method_id: paymentData?.stripe_payment_method_id
            })
            const resourceDetails = await Skill.findOne({ _id: skill_id }) || {};
            const wordGram = resourceDetails.skill_name?.match(/^[aeiou]/i) ? "an" : "a"
            // notification
            const notificationMessage = `Hooray! ${wordGram} ${resourceDetails.skill_name} has been added to your team!`;
            const notificationPath = "/account?tab=plan";
            triggerNotificationServer(user._id, notificationMessage, notificationPath);

            // email notification
            const email = user.settings?.email_notification ? user.email : "";
            const subject = "Hoorray!";
            const htmlFile = notificationEmailTemplate(notificationMessage, null, user.first_name);
            sendNotifnMail(email, subject, htmlFile);

            resolve({ payload: { message: "resource added successfully.", success: true }, status: 200 });
        } catch (e) {
            if (e.errors) {
                resolve({ error: e.errors, status: 400 });
            } else {
                reject({ error: e.message })
            }
        }
    })
}

const changeUserPasswordController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            const { current_password, new_password } = req.body;
            bcrypt.compare(current_password, user.password, async (err, result) => {
                if (!result) {
                    return resolve({ error: { error: "password not matched" }, status: 400 });
                }
                const hashPassword = bcrypt.hashSync(new_password, 10);
                await User.updateOne({ _id: user._id }, {
                    $set: {
                        password: hashPassword
                    }
                })

                // email notification
                const email = user.settings?.email_notification ? user.email : "";
                let message = `Your password reset successfully!`;
                const subject = "Password reset successful";
                const htmlFile = notificationEmailTemplate(message, null, user.first_name);
                sendNotifnMail(email, subject, htmlFile);

                // notification
                let receiver_id = user._id;
                let path = null;
                triggerNotificationServer(receiver_id, message, path).catch(err => console.log(err.message));

                return resolve({ payload: { success: true, message: "Password changed successfully" }, status: 200 });
            })
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const checkResourceExpiredController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = req.headers?.authorization;
            if (!token) {
                return resolve({ payload: {}, status: 200 });
            }
            const ctoken = token.split(" ")[1];
            if (ctoken === "null") {
                return resolve({ payload: {}, status: 200 });
            }
            const user = await validateJWTToken(req, res);
            if (user.role !== "client_admin" && user.role !== "client_member") {
                return resolve({ payload: {}, status: 200 });
            }
            let accountDetails = await Account.findOne({
                [user.role === "client_admin" ? "client_admin" : "client_members.userId"]: user._id
            })
            if (!accountDetails?.added_resources) {
                return resolve({ payload: {}, status: 200 });
            }
            const endDatesOfResources = async () => {
                const length = accountDetails.added_resources?.length;
                const addedResources = accountDetails.added_resources;
                const currDate = new Date();
                const email = user.settings?.email_notification ? user.email : "";
                const subject = "Alert!";

                for (let i = 0; i < length; i++) {
                    const endDate = new Date(addedResources[i].end_date);
                    if (endDate.getTime() < currDate.getTime()) {
                        const skill = await Skill.findOne({ _id: addedResources[i]._id })
                        await Account.updateOne({ _id: accountDetails._id }, {
                            $pull: {
                                "added_resources": {
                                    _id: addedResources[i]._id
                                }
                            },
                            $push: {
                                $push: {
                                    added_resources_history: {
                                        skill_id: addedResources[i].skill_id,
                                        duration: addedResources[i].duration,
                                        stripe_payment_id: addedResources[i].stripe_payment_id,
                                        end_date: addedResources[i].end_date
                                    }
                                }
                            }
                        })

                        // email notification
                        let message = `${skill.skill_name} has expired. Click to purchase it again`;
                        const htmlFile = notificationEmailTemplate(message, null, user.first_name);
                        await sendNotifnMail(email, subject, htmlFile);

                        // notification
                        let receiver_id = user._id;
                        let path = "/addResource";
                        await triggerNotificationServer(receiver_id, message, path).catch(err => console.log(err.message));
                    }
                }
            }
            await endDatesOfResources();

            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const sendForgotPasswordLinkController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email } = req.body;
            if (!email) {
                resolve({ error: { error: "email required." }, status: 400 });
            }
            const user = await User.findOne({ email });
            if (!user) {
                return resolve({ error: { error: "No account found in this email!" }, status: 400 });
            }
            const authHash = crypto.createHmac("sha256", process.env.JSON_SECRET)
                .update(' ' + randomUUID())
                .digest("hex");
            await AuthToken.create({
                body: {
                    id: user._id
                },
                auth_token: authHash
            })
            const authUrl = process.env.WEB_PROTOCOL + req.headers.host + "/reset-password/" + authHash;
            let htmlFile = forgotPasswordHtmlFile(authUrl);
            const response = await mailTransport.sendMail({
                to: email,
                from: process.env.SEND_EMAIL_ID,
                subject: "Forgot password",
                text: `hi ${user.first_name}, click the email to reset password?`,
                html: htmlFile
            }).catch(err => console.log(err));
            resolve({ payload: { success: true, message: "Password reset mail sent" }, status: 200 })
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const completeResetPasswordController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { user_id, new_password, token } = req.body;
            if (!user_id) {
                return resolve({ error: { error: "user_id required." }, status: 400 });
            }
            if (!new_password) {
                return resolve({ error: { error: "new_passwrod required." }, status: 400 });
            }
            const hashPassword = bcrypt.hashSync(new_password, 10);
            const user = await User.findOneAndUpdate({ _id: user_id }, {
                $set: {
                    password: hashPassword
                }
            })
            await AuthToken.deleteOne({ token });

            // email notification
            let message = `Your password reset successfully!`;
            const email = user.settings?.email_notification ? user.email : "";
            const subject = "Password reset successful";
            const htmlFile = notificationEmailTemplate(message, null, user.first_name);
            sendNotifnMail(email, subject, htmlFile);

            // notification
            let receiver_id = user._id;
            let path = null;
            triggerNotificationServer(receiver_id, message, path).catch(err => console.log(err.message));

            resolve({ payload: { success: true, message: "password reseted successfully." }, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const clientPreferenceController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { key, value } = req.body;
            const user = await validateJWTToken(req, res);
            let settings = user.settings;
            settings[key] = value;
            if (key == "auto_renewl") {
                const account = await Account.findOne({
                    [
                        user.role == "client_admin" ? "client_admin"
                            :
                            "client_members.userId"
                    ]: user._id
                })
                if (!account?.active_plan?.subscription_id) {
                } else {
                    if (value) {
                        await stripe.subscriptions.update(account.active_plan.subscription_id, {
                            collection_method: "charge_automatically"
                        })

                        // notification
                        let receiver_id = user._id;
                        let message = `Subscription settings changed. The charge will be credited automatically from your account`;
                        let path = "/account?tab=plan";
                        triggerNotificationServer(receiver_id, message, path);
                    } else {
                        await stripe.subscriptions.update(account.active_plan.subscription_id, {
                            collection_method: "send_invoice",
                            days_until_due: 2
                        })
                        // notification
                        let receiver_id = user._id;
                        let message = `Subscription settings changed. You will get an invoice to renew your expired plan`;
                        let path = "/account?tab=plan";
                        triggerNotificationServer(receiver_id, message, path);
                    }
                }
            }
            // return;
            await User.updateOne({ _id: user._id }, {
                $set: {
                    settings: settings
                }
            })
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

const renewResourceController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { skill_id, duration, currExpirTime, paymentData } = req.body;
            const user = await validateJWTToken(req, res);
            const account = await Account.findOne({
                [user.role == "client_admin" ? "client_admin" : "client_members.userId"]: user._id
            })
            let endDate;
            switch (duration) {
                case "7days":
                    endDate = new Date(currExpirTime)
                    endDate.setDate(endDate.getDate() + 7)
                    break;
                case "14days":
                    endDate = new Date(currExpirTime)
                    endDate.setDate(endDate.getDate() + 14)
                    break;
                case "30days":
                    endDate = new Date(currExpirTime)
                    endDate.setDate(endDate.getDate() + 30)
                    break;
            }

            await Account.updateOne({ _id: account._id, "added_resources.skill_id": mongoose.Types.ObjectId(skill_id) }, {
                $set: {
                    "added_resources.$.end_date": endDate
                }
            });

            await Payment.create({
                paid_date: new Date(),
                paid_amount: paymentData?.stripe_amount,
                paid_currency: paymentData?.stripe_currency,
                paid_type: "renew_resource",
                account_id: account._id,
                resource_id: skill_id,
                resource_duration: duration,
                stripe_payment_id: paymentData?.stripe_payment_id,
                stripe_payment_secret: paymentData?.stripe_client_secret,
                stripe_payment_method_id: paymentData?.stripe_payment_method_id
            }).catch(err => console.log("Error in payment schema", err));

            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const controllers = {
    doUserSignup,
    addNewMember,
    completeClientMemberSignup,
    sendClientAdminVerificatinEmail,
    verifyClientAdminEmail,
    getAccountDetails,
    editAccountDetails,
    listClientMembers,
    removeClientMember,
    listAddResourceSkills,
    addResourceToClientController,
    changeUserPasswordController,
    checkResourceExpiredController,
    sendForgotPasswordLinkController,
    completeResetPasswordController,
    clientPreferenceController,
    renewResourceController
}


export default controllers;