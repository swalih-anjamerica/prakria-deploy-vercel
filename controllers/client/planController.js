import xeroHelper from "../../helpers/xero.helper";
import accountService from "../../server/services/account.services";
import stripeUtils from "../../server/utils/stripe.utils";
import planService from "../../server/services/plan.services";
import paymentService from "../../server/services/payment.services";
import planNotifications from "../../server/notifications/plan.notifications";
import authMiddleware from "../../server/middlewares/auth.middleware";


const getPlanDetailsByUserId = function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            await authMiddleware.authUser(req);
            const userDetails = req.user;
            const { data: accountDetails } = await accountService.getPlanDetails({ userDetails });

            let planDetails = {};
            try {
                const stripeInvoice = await stripeUtils.retriveInvoice({ upcoming: true, stripe_customer_id: accountDetails.stripe_customer_id })
                const stripePeriodEnd = new Date(stripeInvoice?.period_end * 1000);
                const stripePeriodStart = new Date(stripeInvoice?.period_start * 1000);
                planDetails = { ...accountDetails, stripe_subscription_start: stripePeriodStart, stripe_subscription_end: stripePeriodEnd, subscription_status: userDetails.subscription_status };
            } catch (e) {
                planDetails = { ...accountDetails, subscription_status: userDetails.subscription_status };
            }

            resolve({ payload: planDetails, status: 200 });
        } catch (e) {
            reject(e);
        }
    })
}

const planControllers = {
    getPlanDetailsByUserId
}
export default planControllers;

export const listPlansClientService = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = req.user;
            req.query.id = user._id;
            const { data: accountDetails } = await accountService.findAccountFromUser(req)
            if (!accountDetails) {
                return resolve({ error: { error: "Account details not found for this user." }, status: 400 });
            }

            const { data: plans } = await planService.listPlans({ showActive: true });
            resolve({ payload: plans, status: 200 });
        } catch (e) {
            reject(e)
        }
    })
}

export const updateClientSubscriptionComplete = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {

            const user = req.user;
            const { data: accountDetails } = await accountService.findAccount({ client_id: user._id });
            const { plan_id, plan_duration, subscription_id, paymentData } = req.body;

            if (user.role !== "client_admin") {
                return resolve({ error: { error: "Only client admin can change the subscription plan." }, status: 405 });
            }
            if (!accountDetails) {
                return resolve({ error: { error: "account details not found." }, status: 400 });
            }
            if (!plan_id || !plan_duration || !subscription_id) {
                return resolve({ error: { error: "plan_id, plan_duration, subscription_id required." }, status: 400 });
            }

            await accountService.updateAccount({
                account_id: accountDetails._id,
                active_plan: {
                    plan_id,
                    duration: plan_duration,
                    subscription_id
                }
            })
            if (paymentData) {
                await paymentService.createPayment(
                    {
                        ...paymentData,
                        paid_amount: paymentData.stripe_amount,
                        paid_currency: paymentData.stripe_currency,
                        paid_type: "new_subscription",
                        account_id: accountDetails._id,
                        paid_date: new Date(paymentData?.stripe_paid_date * 1000),
                        ...req.body
                    })
                await xeroHelper.markInvoiceAsPaid({
                    invoiceId: paymentData.stripe_payment_id,
                })

            }

            if (!paymentData) {
                planNotifications.moneyNotDebitNotify({plan_id, user_id:user._id});
            }


            resolve({ payload: { success: true, message: "user subscription new added." }, status: 200 });
        } catch (e) {
            reject({ error: e });
        }
    })
}