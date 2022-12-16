import { NextApiRequest, NextApiResponse } from "next";
import stripe from "../../lib/stripe";
import User from "../../models/users";
import Plan from "../../models/plans";
import jsonwebtoken from "jsonwebtoken";
import Account from "../../models/accounts";
import { validateJWTToken } from "../../middlewares/userJWTAuth";
import convertToType from "../../helpers/typeConvert";
import Payment from "../../models/payments";
import bcrypt from "bcrypt";
import { sendNotifnMail, triggerNotificationServer } from "../../helpers/notificationHelper";
import { notificationEmailTemplate } from "../../helpers/mailHtmlFiles";
import xeroHelper from "../../helpers/xero.helper";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export const createStripeSubscription = (req, res) => {
    return new Promise(async (resolve, reject) => {
        let user_id;
        try {
            const { userData, stripeData, planData, description } = req.body;

            if (!userData) {
                return resolve({ error: { message: "userdata required." }, status: 400 });
            }
            if (!stripeData) {
                return resolve({ error: { message: "stripedata required." }, status: 400 });
            }
            if (!planData) {
                return resolve({ error: { message: "plandata required." }, status: 400 });
            }

            const { email, first_name, last_name, password, mobile_number, designation, company_name, time_stamp, name, address, pincode, city, state, country } = userData;
            const { stripe_price_id, stripe_card_token } = stripeData;
            const { plan_id, duration } = planData;

            const existingCustomer = await User.findOne({ email });

            if (!stripe_price_id) {
                return resolve({ error: { error: true, message: "You cannot create a subscription without stripe_price_id.", note: "Subscription not create for one time payment" } })
            }
            if (existingCustomer?.role === "client_admin" && existingCustomer?.payment_completed === true) {
                return resolve({ error: { message: "Email already registerd!", error: true }, status: 400 });
            }
            if (existingCustomer && existingCustomer?.role !== "client_admin") {
                return resolve({ error: { message: "Email already registerd!", error: true }, status: 400 });
            }

            const halfSignedUser = await User.findOne({ email, payment_completed: false })

            // creating user
            const hashPassword = bcrypt.hashSync(password.toString(), 10);

            let createUser;
            if (halfSignedUser) {
                createUser = await User.findOneAndUpdate({ email }, {
                    $set: {
                        first_name,
                        last_name,
                        email,
                        password: hashPassword,
                        mobile_number,
                        role: "client_admin",
                        designation,
                        time_zone: time_stamp,
                        payment_completed: false
                    }
                })
            } else {
                createUser = await User.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: hashPassword,
                    mobile_number: mobile_number,
                    role: "client_admin",
                    designation,
                    time_zone: time_stamp,
                    payment_completed: false
                })
            }

            user_id = createUser._id;
            // stripe (create cutomer and create subscription)
            let stripeCustomer;
            let stripeSubscription;
            if (halfSignedUser) {
                let accountDetails = await Account.findOne({ client_admin: halfSignedUser._id });
                if (accountDetails?.active_plan?.subscription_id) {
                    await stripe.subscriptions.del(
                        accountDetails?.active_plan?.subscription_id
                    )
                }
            }

            stripeCustomer = await stripe.customers.create({
                name: name,
                shipping: {
                    name: name,
                    address: {
                        line1: address,
                        postal_code: pincode,
                        city: city,
                        state: state,
                        country: country,
                    }
                },
                source: stripe_card_token,
                email: email,
            })

            stripeSubscription = await stripe.subscriptions.create({
                customer: stripeCustomer.id,
                items: [
                    {
                        price: stripe_price_id
                    }
                ],
                payment_behavior: "default_incomplete",
                expand: ['latest_invoice.payment_intent'],
                automatic_tax: {
                    enabled: true
                }
            }).catch(async err => {
                return await stripe.subscriptions.create({
                    customer: stripeCustomer.id,
                    items: [
                        {
                            price: stripe_price_id
                        }
                    ],
                    payment_behavior: "default_incomplete",
                    expand: ['latest_invoice.payment_intent'],
                    automatic_tax: {
                        enabled: false
                    }
                })
            })


            // create account
            const acitvePlan = {
                subscription_id: stripeSubscription.id,
                plan_id,
                duration,
                // end_date
            }
            let listProjectManagers = await User.find({ role: "project_manager" });
            if (!listProjectManagers) listProjectManagers = [];
            let randomProjectManager = listProjectManagers[Math.floor(Math.random() * listProjectManagers.length)]

            if (halfSignedUser) {
                let stripe_customer_id=stripeCustomer.id;
                let client_admin=createUser?._id;
                let account_manager=randomProjectManager?._id;
                await Account.findOneAndUpdate({ client_admin: halfSignedUser._id }, {
                    $set: {
                        stripe_customer_id,
                        client_admin,
                        active_plan: acitvePlan,
                        account_manager,
                        company_address: {
                            company_name: company_name
                        }
                    }
                })
            } else {
                await Account.create({
                    stripe_customer_id: stripeCustomer.id,
                    client_admin: createUser._id,
                    active_plan: acitvePlan,
                    account_manager: randomProjectManager?._id,
                    company_address: {
                        company_name: company_name
                    }
                })
            }

            // xero setup
            let tax = stripeSubscription.latest_invoice.tax;
            let subTotal = stripeSubscription.latest_invoice.subtotal_excluding_tax;

            const xeroBody = {
                name: name,
                email: email,
                createdDate: stripeSubscription.latest_invoice.created,
                description: description || "Plan Create ",
                quantity: 1,
                amount: subTotal / 100,
                invoiceNumber: stripeSubscription.latest_invoice.payment_intent.id,
                tax: tax ? tax / 100 : 0,
                currency: stripeSubscription.latest_invoice.currency
            };
            await xeroHelper.createAuthrizedInvoice(xeroBody)

            resolve({ payload: { stripe_secret: stripeSubscription.latest_invoice.payment_intent.client_secret, stripe_subscription_id: stripeSubscription.id, stripe_customer_id: stripeCustomer.id, user_id: createUser._id }, status: 200 })
        } catch (e) {
            // await User.deleteOne({ _id: user_id });
            // await Account.deleteOne({ client_admin: user_id });
            if (e.type === "StripeCardError") {
                return resolve({ error: { message: e.message }, status: 400 })
            }
            reject({ error: { message: e.message, error: true } })
        }
    })
}

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 * @returns 
 */
export const createStripePaymentIntent = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { amount, id, name, email, postal_code, address, city, state, country, stripe_card_token } = req.body;

            if (!email) {
                return resolve({ error: { message: "email required", error: true }, status: 400 });
            }

            const existingCustomer = await User.exists({ email });

            if (existingCustomer) {
                return resolve({ error: { message: "Email already registerd!", error: true }, status: 400 });
            }


            const paymentCreate = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: "GBP",
                payment_method_types: ["card"],
                payment_method: id,
                description: 'Prakria Private ltd.',
                shipping: {
                    name: name,
                    address: {
                        line1: address,
                        postal_code: postal_code,
                        city: city,
                        state: state,
                        country: country,
                    },
                },
            })

            const stripeCustomer = await stripe.customers.create({
                email: email,
                address: {
                    line1: address,
                    postal_code: postal_code,
                    city: city,
                    state: state,
                    country: country,
                },
                source: stripe_card_token
            })


            resolve({
                payload: {
                    payment_intent_secret: paymentCreate.client_secret,
                    payment_intent_id: paymentCreate.id,
                    stripe_customer_id: stripeCustomer.id
                }, status: 200
            })
        } catch (e) {

            resolve({ error: { message: e.message, error_type: e.type }, status: 400 })
        }
    })
}

export const stripeRemoveAccountErrorController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { user_id } = req.body;
            await Account.deleteOne({ client_admin: user_id })
            await User.deleteOne({ _id: user_id });
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

/**
 * @method PUT
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 * @returns 
 */
export const cancellStripeSubscription = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {

            let { action } = req.query;


            if (!action) {
                action = "cancel"
            }

            // getting user id from authorization token
            const token = req.headers.authorization;
            if (!token) return resolve({ status: 400, error: "No token here" });

            const ctoken = token.split(" ")[1];
            if (ctoken === "null") {
                return resolve({ payload: { logedin: false, user: {}, role: null }, status: 200 })
            }

            const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);

            const userDetails = await User.findOne({ _id: id });
            if (userDetails?.role !== "client_admin") {
                return resolve({ error: { error: "members cannot cancel subscription plan." }, status: 405 });
            }
            const accountDetails = await Account.findOne({ client_admin: id });

            // cancel subscription
            if (action === "cancel") {
                const { stripe_subscription_id } = req.body;
                if (!stripe_subscription_id) {
                    return resolve({ error: { error: "no subscription id found." }, status: 400 })
                }
                const deleted = await stripe.subscriptions.del(
                    stripe_subscription_id
                );

                if (deleted?.status === "canceled") {
                    await User.updateOne({ _id: id }, {
                        $set: {
                            subscription_status: "cancelled"
                        }
                    })
                    await Account.updateOne({ client_admin: id }, {
                        $set: {
                            active_plan: {}
                        },
                        $push: {
                            plan_history: {
                                subscription_id: accountDetails.active_plan.subscription_id,
                                plan_id: accountDetails.active_plan.plan_id,
                                duration: accountDetails.active_plan.duration,
                                start_date: accountDetails.active_plan.start_date,
                                end_date: new Date()
                            }
                        }
                    })

                    // this function will update every client members subscription status to cancelled
                    const changeClientMemberSubscriptionToCancel = async () => {

                        const client_members = accountDetails?.client_members;
                        const clientMemberLength = client_members?.length;
                        for (let i = 0; i < clientMemberLength; i++) {
                            await User.updateOne({ _id: client_members[i].userId }, {
                                $set: {
                                    subscription_status: "cancelled"
                                }
                            })
                        }
                    }

                    await changeClientMemberSubscriptionToCancel();

                    resolve({ payload: { success: true, cancelledAt: deleted.cancel_at, currentPeriodEnd: deleted.current_period_end }, status: 200 })
                } else {
                    resolve({ error: { error: "something went wrong", code: 503 }, status: 400 })
                }
            }

        } catch (e) {
            reject({ error: e.message });
        }
    })
}

export const upgradeSubscriptionController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            const { price_id, plan_id, plan_duration } = req.body;
            if (!price_id || !plan_id || !plan_duration) {
                return resolve({ error: { error: " price_id, plan_id, plan_duration should't be null." }, status: 400 });
            }
            if (user.role !== "client_admin") {
                return resolve({ error: { error: "Only client admin can change the subscription plan." }, status: 405 });
            }
            const accountDetails = await Account.findOne({ client_admin: user._id });
            if (!accountDetails) {
                return resolve({ error: { error: "account details not found." }, status: 400 });
            }
            const subscription = await stripe.subscriptions.retrieve(accountDetails?.active_plan.subscription_id);
            const planDetails = await Plan.findOne({ _id: plan_id });

            const updateSubscription = await stripe.subscriptions.update(subscription.id, {
                cancel_at_period_end: false,
                proration_behavior: "always_invoice",
                payment_behavior: "default_incomplete",
                items: [{
                    id: subscription.items.data[0].id,
                    price: price_id,
                }],
            })

            if (updateSubscription.status !== "active") {
                const stripeInvoiceRes = await stripe.invoices.pay(updateSubscription.latest_invoice);
                const stripe_payment_id = stripeInvoiceRes.payment_intent;
                const stripe_payment_method_id = stripeInvoiceRes.id;
                const paid_amount = stripeInvoiceRes.amount_paid;
                const paid_currency = stripeInvoiceRes.currency;
                const paid_type = "update_subscription";
                const account_id = accountDetails._id;
                const paid_date = new Date(stripeInvoiceRes.created * 1000);
                await Payment.create({
                    stripe_payment_id,
                    stripe_payment_method_id,
                    paid_amount,
                    paid_currency,
                    paid_type,
                    account_id,
                    paid_date,
                    plan_duration,
                    plan_id
                })

                let tax = stripeInvoiceRes.tax;
                let subTotal = stripeInvoiceRes.subtotal_excluding_tax;
                let description = `${planDetails?.title} - ${plan_duration} upgrade`;

                const xeroBody = {
                    name: stripeInvoiceRes.customer_name,
                    email: stripeInvoiceRes.customer_email,
                    createdDate: stripeInvoiceRes.created,
                    description: description || "Plan update",
                    quantity: 1,
                    amount: subTotal / 100,
                    invoiceNumber: stripeInvoiceRes.payment_intent.id,
                    tax: tax ? tax / 100 : 0,
                    currency: stripeInvoiceRes.currency
                };
                await xeroHelper.createPaidInvoice(xeroBody)
            }

            await Account.updateOne({ _id: accountDetails._id }, {
                $set: {
                    "active_plan.plan_id": plan_id,
                    "active_plan.duration": plan_duration
                },
                $push: {
                    plan_history: {
                        subscription_id: accountDetails.active_plan.subscription_id,
                        plan_id: accountDetails.active_plan.plan_id,
                        duration: accountDetails.active_plan.duration,
                        start_date: accountDetails.active_plan.start_date,
                        end_date: new Date()
                    }
                }
            })

            //notification
            const email = user.settings?.email_notification ? user.email : "";
            const message = `Congratulations! Your plan has been upgraded to ${planDetails?.title}.`;
            const subject = "Congratulations!";
            const htmlFile = notificationEmailTemplate(message);
            const user_id = user._id;
            const path = "/account?tab=plan";
            sendNotifnMail(email, subject, htmlFile)
            triggerNotificationServer(user_id, message, path);

            resolve({ payload: { succes: true, message: "Subscription upgraded successfully." }, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

export const listSavedCardsController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            const accountDetails = await Account.findOne({
                [user.role === "client_admin" ? "client_admin" : "client_member.userId"]: user._id
            });
            if (!accountDetails) {
                return resolve({ payload: {}, status: 200 });
            }
            const savedCards = await stripe.customers.listSources(accountDetails.stripe_customer_id)
            const customerDetails = await stripe.customers.retrieve(accountDetails.stripe_customer_id);
            if (!savedCards.data) {
                resolve({ payload: [], status: 200 });
            }
            resolve({ payload: { cards: savedCards?.data, default_source: customerDetails.default_source }, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

export const addNewCreditCardController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userDetails = await validateJWTToken(req, res);
            if (userDetails.role !== "client_admin") {
                return resolve({ error: { error: "Only client admin can add card" }, status: 400 });
            }
            const { cardNumber, exp_month, exp_year, cvc } = req.body;
            const accountDetails = await Account.findOne({ client_admin: userDetails._id });
            const token = await stripe.tokens.create({
                card: {
                    number: cardNumber,
                    exp_month: exp_month,
                    exp_year: exp_year,
                    cvc: cvc
                }
            })

            const card = await stripe.customers.createSource(
                accountDetails.stripe_customer_id,
                {
                    source: token.id
                }
            )
            await stripe.customers.update(accountDetails.stripe_customer_id, {
                default_source: card.id
            })

            resolve({ payload: { success: true, message: "new card added successfully." }, status: 200 });
        } catch (e) {
            if (e?.type === "StripeCardError") {
                return resolve({ error: { error: e.message }, status: 400 });
            }
            reject({ error: e.message });
        }
    })
}

export const addNewSubscriptionController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            if (user.role !== "client_admin") {
                return resolve({ error: { error: "Only client admin can change the subscription plan." }, status: 405 });
            }
            const accountDetails = await Account.findOne({ client_admin: user._id });
            if (!accountDetails) {
                return resolve({ error: { error: "No account details find." }, status: 400 });
            }
            const { stripe_price_id, plan_id, plan_duration } = req.body;
            if (!stripe_price_id) {
                return resolve({ error: { error: "stripe_price_id required." }, status: 400 });
            }
            const stripeSubscription = await stripe.subscriptions.create({
                customer: accountDetails?.stripe_customer_id,
                items: [
                    {
                        price: stripe_price_id
                    }
                ],
                payment_behavior: "default_incomplete",
                expand: ['latest_invoice.payment_intent'],
                automatic_tax: {
                    enabled: true
                }
            }).catch(async err => {
                return await stripe.subscriptions.create({
                    customer: accountDetails?.stripe_customer_id,
                    items: [
                        {
                            price: stripe_price_id
                        }
                    ],
                    payment_behavior: "default_incomplete",
                    expand: ['latest_invoice.payment_intent'],
                    automatic_tax: {
                        enabled: false
                    }
                })
            }
            )

            const planDetails = await Plan.findOne({ _id: plan_id });
            let tax = stripeSubscription.latest_invoice.tax;
            let subTotal = stripeSubscription.latest_invoice.subtotal_excluding_tax;
            let description = `${planDetails?.title} - ${plan_duration} upgrade`;

            if (stripeSubscription.latest_invoice.payment_intent?.client_secret) {
                let latestInvoice = stripeSubscription.latest_invoice;
                const xeroBody = {
                    name: latestInvoice.customer_name,
                    email: latestInvoice.customer_email,
                    createdDate: latestInvoice.created,
                    description: description || "Plan update",
                    quantity: 1,
                    amount: subTotal / 100,
                    invoiceNumber: latestInvoice.payment_intent.id,
                    tax: tax ? tax / 100 : 0,
                    currency: latestInvoice.currency
                };
                await xeroHelper.createAuthrizedInvoice(xeroBody)
            }



            resolve({ payload: { stripe_secret: stripeSubscription.latest_invoice.payment_intent?.client_secret, stripe_subscription_id: stripeSubscription.id, stripe_customer_id: accountDetails?.stripe_customer_id }, status: 200 })
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

export const createNormalPaymentIntentController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { amount, currency, stripe_customer_id, description, stripe_card_id } = req.body;
            if (!amount || !currency || !stripe_customer_id || !stripe_card_id) {
                return resolve({ error: { error: "amount, currency, stripe_customer_id, stripe_card_id required." }, status: 400 });
            }
            const customerDetails = await stripe.customers.retrieve(stripe_customer_id);
            if (!customerDetails.shipping) {
                return resolve({ error: { error: "this customer has no shipping address." }, status: 400 })
            };
            const paymentCreate = await stripe.paymentIntents.create({
                amount: parseInt(amount) * 100,
                currency: currency,
                payment_method_types: ["card"],
                payment_method: stripe_card_id,
                description: description,
                shipping: customerDetails.shipping,
                customer: stripe_customer_id
            })

            // xero invoicing
            const xeroBody = {
                name: customerDetails.shipping.name,
                email: customerDetails.email,
                createdDate: paymentCreate.created,
                description: description,
                quantity: 1,
                amount: amount,
                invoiceNumber: paymentCreate.id,
                tax: 0
            };

            await xeroHelper.createPaidInvoice(xeroBody)

            resolve({
                payload: {
                    payment_intent_secret: paymentCreate.client_secret,
                    payment_intent_id: paymentCreate.id,
                }, status: 200
            })
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

export const deleteCreditCardController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { customer_id, card_id } = req.body;
            if (!customer_id || !card_id) {
                return resolve({ error: { error: "customer_id and card_id required." }, status: 400 })
            }
            const deleted = await stripe.customers.deleteSource(
                customer_id,
                card_id
            )
            if (!deleted) {
                return resolve({ error: { error: "card not deleted." }, status: 400 });
            }
            resolve({ payload: { success: true, message: "success" }, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}



export const stripeCheckApiController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { stripe_subscription_id } = req.query;
            const subscription = await stripe.subscriptions.retrieve(stripe_subscription_id);
            const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
            resolve({ payload: invoice, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

export const stripeGetSubscriptionLatestInvoiceController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await validateJWTToken(req, res);
            const accountDetails = await Account.findOne({ client_admin: user._id });
            if (!accountDetails) {
                return resolve({ error: "User has no account", status: 400 });
            }
            if (!accountDetails?.active_plan?.subscription_id) {
                return resolve({ error: "User ha no subscription id", status: 400 });
            }
            const subscriptionRetrive = await stripe.subscriptions.retrieve(accountDetails?.active_plan?.subscription_id);
            const latestInvoice = await stripe.invoices.retrieve(subscriptionRetrive.latest_invoice);
            let invoicePaymentUrl = latestInvoice.hosted_invoice_url;
            let invoiceId = latestInvoice.id;
            let payload = { invoicePaymentUrl, invoiceId };
            resolve({ payload, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}