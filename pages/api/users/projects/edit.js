import { NextApiRequest, NextApiResponse } from "next"
import { projectEditController } from "../../../../controllers/client/projects/projectController";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */

export default async function handler(req, res) {

    const method = req.method;

    try {
        if (method === "PUT") {
            const { error, payload, status } = await projectEditController(req, res);
            res.status(status).json(error || payload);
        }
        res.status(401).send();
    } catch (error) {
        res.status(500).json({ error: error.error || error })
    }
}


