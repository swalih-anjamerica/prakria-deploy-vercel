import { NextApiRequest, NextApiResponse } from "next";
import chatController, { chatSceneUserController } from "../../../../controllers/user/chatController";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function handler(req, res) {
    try {
        const method=req.method;
        if(method==="POST"){
            const { status, error, payload } = await chatController.sendMessageOnProject(req, res);
            res.status(status).json(error || payload);
        }
        else if(method==="PUT"){
            const { status, error, payload } = await chatController.sendMessageOnProject(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }
}