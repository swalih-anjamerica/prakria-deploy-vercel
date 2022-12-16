import { Invoice } from "xero-node";
import { XERO_ACCOUNT_CODE } from "../constants/env.constants";
import xero from "../lib/xero.lib";

const sendInvoiceEmail = async (invoiceID) => {

    if (!invoiceID) return;

    const requestEmpty = {};

    try {
        await xero.accountingApi.emailInvoice("", invoiceID, requestEmpty);
        return {
            data: true,
            status: 200
        }
    } catch (err) {
        return {
            error: error,
            status: 400
        }
    }
}

const createPaidInvoice = async (invoiceBody) => {
    try {
        const { name, email, createdDate, description, quantity, amount, invoiceNumber, tax, currency } = invoiceBody;
        const xeroDate = !createdDate ? new Date() : new Date(createdDate * 1000).toISOString().split("T")[0];
        await xero.getClientCredentialsToken();
        const invoices = {
            invoices: [
                {
                    type: Invoice.TypeEnum.ACCREC,
                    status: Invoice.StatusEnum.AUTHORISED,
                    contact: {
                        name: name,
                        emailAddress: email
                    },
                    sentToContact: true,
                    date: xeroDate,
                    dueDate: xeroDate,
                    lineAmountTypes: "Exclusive",
                    lineItems: [
                        {
                            description: description,
                            quantity: quantity,
                            unitAmount: amount,
                            accountCode: XERO_ACCOUNT_CODE,
                            taxAmount: tax
                        }
                    ],
                    invoiceNumber: invoiceNumber,
                    currencyCode: currency || "gbp"
                }
            ]
        }
        const createdInvoicesResponse = await xero.accountingApi.createInvoices("", invoices);
        const paymentResponse = await xero.accountingApi.createPayment("", {
            account: {
                code: XERO_ACCOUNT_CODE
            },
            invoice: {
                invoiceID: createdInvoicesResponse.body.invoices[0].invoiceID
            },
            amount: createdInvoicesResponse.body.invoices[0].amountDue,
            date: xeroDate
        })
        await sendInvoiceEmail(createdInvoicesResponse.body.invoices[0].invoiceID);
        return {
            data: { paymentResponse, createdInvoicesResponse },
            status: 200
        }
    } catch (e) {
        return {
            error: e,
            status: 400
        }
    }
}

const createAuthrizedInvoice = async (invoiceBody) => {
    try {
        const { name, email, createdDate, description, quantity, amount, invoiceNumber, tax, currency } = invoiceBody;
        const xeroDate = !createdDate ? new Date() : new Date(createdDate * 1000).toISOString().split("T")[0];
        await xero.getClientCredentialsToken();
        const invoices = {
            invoices: [
                {
                    type: Invoice.TypeEnum.ACCREC,
                    status: Invoice.StatusEnum.AUTHORISED,
                    contact: {
                        name: name,
                        emailAddress: email
                    },
                    sentToContact: true,
                    date: xeroDate,
                    dueDate: xeroDate,
                    lineAmountTypes: "Exclusive",
                    lineItems: [
                        {
                            description: description,
                            quantity: quantity,
                            unitAmount: amount,
                            accountCode: XERO_ACCOUNT_CODE,
                            taxAmount: tax
                        }
                    ],
                    invoiceNumber: invoiceNumber,
                    currencyCode: currency || "gbp"
                }
            ]
        }
        const createdInvoicesResponse = await xero.accountingApi.createInvoices("", invoices);
        return {
            data: createdInvoicesResponse,
            status: 200
        }
    } catch (e) {
        console.log(e);
        return {
            error: e,
            status: 400
        }
    }
}

const markInvoiceAsPaid = async (paymentBody) => {
    try {
        const { invoiceId, createdDate } = paymentBody;
        const xeroDate = !createdDate ? new Date().toISOString().split("T")[0] : new Date(createdDate * 1000).toISOString().split("T")[0];
        await xero.getClientCredentialsToken();

        const invoices = await xero.accountingApi.getInvoice("", invoiceId);
        const paymentResponse = await xero.accountingApi.createPayment("", {
            account: {
                code: XERO_ACCOUNT_CODE
            },
            invoice: {
                invoiceID: invoices.body.invoices[0].invoiceID
            },
            amount: invoices.body.invoices[0].amountDue,
            date: xeroDate
        })

        await sendInvoiceEmail(invoices.body.invoices[0].invoiceID);

        return {
            data: paymentResponse,
            status: 200
        }
    } catch (e) {
        return {
            error: e,
            status: 400
        }
    }
}

const getInvoiceOnlineUrl = async (paymentId) => {
    try {
        await xero.getClientCredentialsToken();
        const invoice = await xero.accountingApi.getInvoice("", paymentId);
        if (!invoice) {
            return {
                error: "No invoice found",
                status: 400
            }
        }
        const invoiceUrl = await xero.accountingApi.getOnlineInvoice("", invoice.body.invoices[0].invoiceID);

        return {
            data: invoiceUrl.body.onlineInvoices[0].onlineInvoiceUrl,
            status: 200
        }
    } catch (e) {
        return {
            error: e,
            status: 400
        }
    }
}

const xeroHelpers = {
    createPaidInvoice,
    createAuthrizedInvoice,
    markInvoiceAsPaid,
    getInvoiceOnlineUrl
}

export default xeroHelpers;