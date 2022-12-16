import paymentController from "../../../../controllers/client/paymentController";
import authMiddleware from "../../../../server/middlewares/auth.middleware";

export default async function handler(req, res) {
    try {
        const method = req.method;
        const params = req.query.params[0];

        await authMiddleware.authUser(req);
        if (method === "POST" && params === "create") {
            const { error, payload, status } = await paymentController.createPaymentController(req, res);
            res.status(status).json(error || payload);
        }
        else if (method === "GET" && params === "list-for-client") {
            const { error, payload, status } = await paymentController.listAllPaymentsFromDBController(req, res);
            res.status(status).json(error || payload);
        }
        // else if (method === "POST" && params === "download-pdf") {
        //     const { error, payload, status } = await paymentController.downloadPaymentPdfController(req, res);
        //     res.status(status).json(error || payload);
        // }
        else if (method === "GET" && params === "invoice") {
            const { error, payload, status } = await paymentController.downloadPaymentInvoice(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }
}