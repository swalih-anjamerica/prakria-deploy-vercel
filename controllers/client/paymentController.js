import convertToType from "../../helpers/typeConvert";
import xeroHelper from "../../helpers/xero.helper";
import paymentService from "../../server/services/payment.services";
import accountService from "../../server/services/account.services";
import userService from "../../server/services/user.services";


const createPaymentController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            await paymentService.createPayment({...req.body});
            resolve({ payload: { success: true }, status: 200 });
        } catch (e) {
            reject(e);
        }
    })
}

const listAllPaymentsFromDBController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {client_id } = req.query;
            let user;
            if (!convertToType(client_id)) {
                user = req.user;
            } else {
                req.query.id=client_id;
                user = await userService.findUserById(req);
            }
            req.query.id=user._id;
            const {data:accountDetails}=await accountService.findAccountFromUser(req);
            if (!accountDetails) {
                return resolve({ payload: {}, status: 200 });
            }
            const {data:response}=await paymentService.listAllPayment({...req.query, accountDetails});
            resolve({ payload: { payments:response.payments, total: response.total }, status: 200 })
        } catch (e) {
            reject(e)
        }
    })
}

const downloadPaymentInvoice = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { payment_id } = req.query;
            if (!payment_id) {
                return resolve({
                    error: "payment_id required",
                    status: 400
                })
            }
            const { data, error } = await xeroHelper.getInvoiceOnlineUrl(payment_id);
            if (error) {
                return resolve({
                    error: error,
                    status: 400
                })
            }
            resolve({ payload: { url: data }, status: 200 });
        } catch (e) {
            reject({ error: e.message })
        }
    })
}

const controllers = {
    createPaymentController,
    listAllPaymentsFromDBController,
    downloadPaymentInvoice
}

export default controllers;