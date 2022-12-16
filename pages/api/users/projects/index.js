import { NextApiRequest, NextApiResponse } from "next"
import { createProject, listAllProject, getProjectDetailsById } from "../../../../controllers/client/projects/projectController";
import authMiddleware from "../../../../server/middlewares/auth.middleware";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */

export default async function handler(req, res) {

    const { method } = req

    try {
        await authMiddleware.authUser(req);
        if(method==="GET"){
            const { payload, error, status } = await listAllProject(req, res);
            res.status(status).json(error||payload);
        }else if(method==="POST"){
            const { payload, error, status } = await createProject(req, res);
            res.status(status).json(error||payload);
        }
    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }
}


