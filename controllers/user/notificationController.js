import mongoose from "mongoose";
import { validateJWTToken } from "../../middlewares/userJWTAuth";
import Notification from "../../models/notifications";
import Account from "../../models/accounts";
import User from "../../models/users";
import { sendNotifnMail, triggerNotificationServer } from "../../helpers/notificationHelper";
import stripe from "../../lib/stripe";
import { notificationEmailTemplate } from "../../helpers/mailHtmlFiles";


export const listNotificationsController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { category, page, limit } = req.query;
            const user = await validateJWTToken(req, res);
            if (!user) return;
            let { type } = req.query;
            if (!type) {
                type = "common";
            }
            if (!page) page = 1;
            if (!limit) limit = 20;

            let searchParams = { receiver: user._id };
            if (category === "un_read") {
                searchParams = { ...searchParams, is_read: false };
            }
            const notifications = await Notification.find(searchParams).sort({ created_at: -1 }).skip((page * limit) - limit).limit(limit);
            const totalCount=await Notification.find(searchParams).count();
            const unReadNoticiationLength = await Notification.find({ receiver: user._id, type, is_seen: false }).count();

            resolve({ payload: { notifications, total:totalCount, count: unReadNoticiationLength }, status: 200 });
        } catch (e) {
            reject({ error: e.error || e.message });
        }
    })
}

export const deleteNotificationController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { notification_id } = req.query;
            if (!mongoose.isValidObjectId(notification_id)) {
                return resolve({ error: { error: "notification_id must be valid objectid" }, status: 400 });
            }
            const { deletedCount } = await Notification.deleteOne({ _id: notification_id });
            if (deletedCount < 1) {
                return resolve({ payload: { success: false, message: "not deleted" }, status: 204 });
            }
            resolve({ payload: { success: true, message: "Deleted successfully." }, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}


export const readNotificationController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { notification_id } = req.body;
            await Notification.updateOne({ _id: notification_id }, {
                $set: {
                    is_read: true
                }
            })
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

export const seenAllNotificationController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            await Notification.updateMany({ receiver: user._id, is_seen: false },
                {
                    $set: {
                        is_seen: true
                    }
                })
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

export const markAllNotificationController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            await Notification.updateMany({ receiver: user._id, is_read: false },
                {
                    $set: {
                        is_read: true
                    }
                })
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}


export const completeAccDetailsNotfnController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accountIncompleteUsers = await Account.aggregate([
                {
                    $match: {
                        $or: [
                            { "company_address.company_name": null },
                            { "company_address.address": null },
                            { "company_address.country": null },
                            { "company_address.industry": null },
                            { "company_address.pincode": null },
                            { "company_address.state": null },
                            { "company_address.website": null },
                            { "company_address.taxcode": null },
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "client_admin",
                        foreignField: "_id",
                        as: "users"
                    }
                },
                {
                    $unwind: "$users"
                },
                {
                    $replaceRoot: {
                        newRoot: "$users"
                    }
                }
            ])

            let usersLength = accountIncompleteUsers.length;
            for (let i = 0; i < usersLength; i++) {
                let user = await accountIncompleteUsers[i];
                let receiver_id = user._id;
                let email = user.settings?.email_notification ? user.email : null;
                let message = "Help us know you better. There are important details missing in your account. Update Now!";
                let path = "/account?tab=company";
                let authUrl = process.env.WEB_PROTOCOL + req.headers.host + path;
                let htmlBody = notificationEmailTemplate(message, authUrl, user.first_name);
                triggerNotificationServer(receiver_id, message, path);
                sendNotifnMail(email, "Alert..", htmlBody);
            }
            resolve({ payload: {}, status: 200 })
        } catch (e) {
            resolve({ payload: {}, status: 200 });
        }
    })
}

export const needAnyAssNtfyController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await User.find({
                $or: [
                    { role: "client_admin" },
                    { role: "client_member" }
                ]
            });
            let userLength = users.length;
            for (let i = 0; i < userLength; i++) {
                let user = await users[i];
                let receiver_id = user._id;
                let email = user.settings?.email_notification ? user.email : null;
                let message = "Need any assistance? Reach out to us directly!";
                let htmlBody = notificationEmailTemplate(message, null, user.first_name);
                triggerNotificationServer(receiver_id, message);
                sendNotifnMail(email, "Alert..", htmlBody);
            }
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            resolve({ payload: {}, status: 200 });
        }
    })
}

export const prakriaCompleteAccountNtryController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await User.find({
                $or: [
                    { mobile_number: "" },
                    { mobile_number: null }
                ],
                $or: [
                    { role: "project_manager" },
                    { role: "designer" }
                ]
            })
            let userLength = users.length;
            for (let i = 0; i < userLength; i++) {
                let user = await users[i];
                let receiver_id = user._id;
                let email = user.settings?.email_notification ? user.email : null;
                let message = "Please complete your account details";
                let htmlBody = notificationEmailTemplate(message, null, user.first_name);
                triggerNotificationServer(receiver_id, message);
                sendNotifnMail(email, "Alert..", htmlBody);
            }
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            resolve({ payload: {}, status: 200 });
        }
    })
}

export const expiryNtfnController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const autoRenwalOffUser = await User.aggregate([
                {
                    $match: {
                        "settings.auto_renewl": false
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
                    $unwind: "$account"
                },
                {
                    $match: {
                        $and: [
                            { "account.active_plan.subscription_id": { $ne: null } },
                            { "account.active_plan.subscription_id": { $ne: "" } }
                        ]
                    }
                }
            ])

            let accountsLength = autoRenwalOffUser.length;
            let stripeSubscription;
            let subscriptionId;
            let account;
            let expirTime;
            let message;
            let user;
            let receiver_id;
            let email;
            let htmlBody;

            for (let i = 0; i < accountsLength; i++) {
                user = autoRenwalOffUser[i];
                account = autoRenwalOffUser[i].account;
                subscriptionId = account.active_plan.subscription_id;
                stripeSubscription = await stripe.subscriptions.retrieve(
                    subscriptionId
                )
                email = user.settings?.email_notification ? user.email : null;
                receiver_id = user._id;
                expirTime = getExpirTime(stripeSubscription.current_period_end);

                if (expirTime <= 2 && expirTime >= 0) {
                    message = "We'll miss you if you leave! Your Plan is about to expire. Upgrade Now!"
                    htmlBody = notificationEmailTemplate(message);
                    sendNotifnMail(email, "Alert..", htmlBody);
                }
                if (expirTime < 0) {
                    message = "We'll miss you if you leave! Your Plan has expired. Upgrade Now!";
                    htmlBody = notificationEmailTemplate(message);
                    triggerNotificationServer(receiver_id, message);
                }


            }

            // compare expire time and current time
            function getExpirTime(time) {
                time = time * 1000;
                let expirDate = new Date(time);
                let currDate = new Date();
                let diffTime = expirDate.getTime() - currDate.getTime();
                let diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                return diffDay;
            }

            resolve({ payload: {}, status: 200 });
        } catch (e) {
            resolve({ payload: {}, status: 200 });
        }
    })
}