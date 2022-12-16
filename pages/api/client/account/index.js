import { NextApiRequest, NextApiResponse } from "next"
import clientAccount from "../../../../controllers/client/account"

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function hander(req, res) {
    const { method } = req;

    try {
         if (method === "GET") {
            const { error, status, payload } = await await clientAccount.getAccountDetails(req, res);
            res.status(status).json(error || payload);
        }
        else if (method === "PUT") {
            const { error, status, payload } = await clientAccount.editAccountDetails(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(500).json({ error: e?.error || e?.message });
    }

}