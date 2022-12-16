import { NextApiRequest, NextApiResponse } from "next"
import clientAccount from "../../../controllers/client/account";
import planController from "../../../controllers/client/planController";
import paymentController from "../../../controllers/client/paymentController";
import authMiddleware from "../../../server/middlewares/auth.middleware";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function hander(req, res) {
    const { method } = req;
    const params = req.query.params[0];

    try {
        // await authMiddleware.authUser(req);
        if (params === "signup" && method === "POST") {
            const { error, status, payload } = await clientAccount.doUserSignup(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "plan" && method === "GET") {
            const { error, status, payload } = await planController.getPlanDetailsByUserId(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "account-verify-email-send" && method === "POST") {
            const { error, status, payload } = await clientAccount.sendClientAdminVerificatinEmail(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "account-verify" && method === "POST") {
            const { error, status, payload } = await clientAccount.verifyClientAdminEmail(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }

}