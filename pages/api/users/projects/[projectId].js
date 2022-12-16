import { NextApiRequest, NextApiResponse } from "next"
import { getProjectDetailsById, linkBrandToProject } from "../../../../controllers/client/projects/projectController";
import authMiddleware from "../../../../server/middlewares/auth.middleware";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */

export default async function handler (req, res) {

    const method=req.method;

    try {
        await authMiddleware.authUser(req);
        if(method==="GET"){
            const { payload, error, status } = await getProjectDetailsById(req, res);
            res.status(status).json(error||payload);
        }
        else if(method==="PUT"){
            const { payload, error, status } = await linkBrandToProject(req, res);
            res.status(status).json(error||payload);
        }

    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }
}


