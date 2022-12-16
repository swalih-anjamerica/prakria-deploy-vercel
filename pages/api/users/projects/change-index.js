import { NextApiRequest, NextApiResponse } from "next"
import { projectOrderController } from "../../../../controllers/client/projects/projectController";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */

export default async function handler(req, res) {

   const method=req.method;

    try {
        if(method==="POST"){
            const { payload, error, status } = await projectOrderController(req, res);
            res.status(status).json(error||payload);
        }
    } catch (error) {
        res.status(500).json({ error: error.error || error })
    }
}


