import { useQuery } from "react-query";
import API from "./api";

export const createPaymentService = async (paid_amount, paid_currency, paid_type, plan_duration, account_id, plan_id, resource_id, stripe_payment_id, stripe_payment_method_id) => {
    const body = {
        paid_amount,
        paid_currency,
        paid_type,
        plan_duration,
        account_id,
        plan_id,
        resource_id,
        stripe_payment_id,
        stripe_payment_method_id
    }
    return API.post("/client/payment/create", body);
}

export const listClientPaymentsService = (params) => {
    return useQuery(["payment_details", params], () => {
        const { page, limit, listByMonth, from, to, clientID } = params || {};
        return API.get(`/client/payment/list-for-client?from=${from}&to=${to}&page=${page}&limit=${limit}&by_month=${listByMonth}&client_id=${clientID}`).catch(err => {
            console.log(err.response);
        })
    },
        {
            select: data => data.data
        }
    )
}

export const downloadPaymentPdfService = (params) => {
    if (!params) {
        params = {};
    }
    const { page, limit, listByMonth, from, to } = params;
    return API.post(`/client/payment/download-pdf?from=${from}&to=${to}&page=${page}&limit=${limit}&by_month=${listByMonth}`).catch(err => {
        console.log(err.response);
    })
}

export const getPaymentInvoiceService = (params) => {
    const { payment_id } = params || {};
    return API.get(`/client/payment/invoice?payment_id=${payment_id}`);
}