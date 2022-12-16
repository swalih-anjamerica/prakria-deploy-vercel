import { NextApiRequest, NextApiResponse } from "next";
import { getResourceTimeStampController } from "../../../../controllers/superadmin/activityLogController";
import authMiddleware from "../../../../server/middlewares/auth.middleware";


/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function handler(req, res) {
    const params = req.query.params[0];
    const method = req.method;

    try {
        await authMiddleware.authUser(req, "super_admin");
        if (params === "list" && method === "GET") {
            const { status, payload, error } = await getResourceTimeStampController(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message });
    }
}