import { NextApiRequest, NextApiResponse } from "next";
import teamConnectController from "../../../../../controllers/user/teamConnectController";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function handler(req, res) {
    try {
        const method = req.method;

        if (method === "GET") {
            const { error, payload, status } = await teamConnectController.listConnectTeams(req, res);
            res.status(status).json(payload || error);
        }
        else if (method === "POST") {
            const { error, payload, status } = await teamConnectController.createConnectTeam(req, res);
            res.status(status).json(payload || error);
        }
    } catch (e) {
        console.log(e.error);
        res.status(500).json({ error: e?.error || e?.message })
    }
}