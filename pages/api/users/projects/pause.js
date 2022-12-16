import { NextApiRequest, NextApiResponse } from "next"
import { projectPauseController } from "../../../../controllers/client/projects/projectController";
import authMiddleware from "../../../../server/middlewares/auth.middleware";


/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */

export default async function handler(req, res) {

    const method=req.method;

    try {
        await authMiddleware.authUser(req);
        if (method === "POST") {
            const { error, payload, status } = await projectPauseController(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }
}


