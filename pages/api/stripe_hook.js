import Stripe from "stripe";
import { buffer } from "micro";
import Payment from "../../models/payments";
import Account from "../../models/accounts";
import User from "../../models/users";
import StripeHook from "../../models/stripe_hook";
import { sendNotifnMail, triggerNotificationServer } from "../../helpers/notificationHelper";
import { cardDeclineHtmlFile } from "../../helpers/mailHtmlFiles";

export const config = {
    api: {
        bodyParser: false,
    },
};
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
    apiVersion: "2020-08-27",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        switch (event.type) {
            case "invoice.payment_failed":
                invoiceFailureHanlder(req, event.data.object.customer);
                break;

            case "invoice.created":
                await addInvoicePayment(event.data.object);
                break;

            case "payment_intent.succeeded":
                await paymentIntentPaidHandler(event.data);
                // await addInvoicePayment(event.data.object);
                break
        }

        await StripeHook.collection.insertOne({ ...event, created_at: new Date() });
    } catch (err) {
        console.log(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    res.status(200).send();
};

const addInvoicePayment = async (invoiceData) => {
    if (!invoiceData) {
        return;
    }
    const accountDetails = await Account.findOne({ stripe_customer_id: invoiceData.customer, "active_plan.subscription_id": invoiceData.subscription })
    if (!accountDetails) {
        return;
    }
    const planDetails = accountDetails.active_plan;
    const data = await Payment.create({
        paid_date: new Date(invoiceData.created * 1000),
        paid_amount: invoiceData.amount_paid,
        paid_currency: invoiceData.currency,
        paid_type: "update_subscription",
        account_id: accountDetails._id,
        stripe_payment_id: invoiceData.payment_intent,
        stripe_payment_method_id: invoiceData.id,
        plan_id: planDetails.plan_id,
        plan_duration: planDetails.duration
    })
    console.log(data);
}

const paymentIntentPaidHandler = async (event) => {
    let customerId = event.object.customer;
    let accountDetails = await Account.findOne({ stripe_customer_id: customerId });
    if (!accountDetails) {
        return;
    }
    let userDetails = await User.findOne({ _id: accountDetails._id });
    if (userDetails.payment_completed === false) {
        await User.updateOne({ _id: userDetails._id }, {
            $set: {
                payment_completed: true
            }
        })
    }
}

const invoiceFailureHanlder = async (req, customer_id) => {
    try {
        const account = await Account.aggregate([
            {
                $match: {
                    stripe_customer_id: customer_id
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "client_admin",
                    foreignField: "_id",
                    as: "client"
                }
            },
            {
                $unwind: "$client"
            }
        ])
        const { email, _id } = account?.client || {};
        let message = "The card you provided has been declined. Please update your credit card or subscription will be cancelled";
        let path = "/account?tab=account_details";
        let authUrl = process.env.WEB_PROTOCOL + req.headers.host + path;
        let htmlBody = cardDeclineHtmlFile(authUrl);
        triggerNotificationServer(_id, message, path);
        sendNotifnMail(email, "Card declined", htmlBody);
    } catch (e) {
        console.log(e.message);
    }
}

export default handler;
