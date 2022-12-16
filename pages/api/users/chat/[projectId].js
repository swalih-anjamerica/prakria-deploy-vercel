import { NextApiRequest, NextApiResponse } from "next";
import chatController from "../../../../controllers/user/chatController";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function handler(req, res) {
    try {
        const method = req.method;
        if (method === "GET") {
            const { status, error, payload } = await chatController.getProjectChats(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }
}