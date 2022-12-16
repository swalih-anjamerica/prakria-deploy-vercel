import { NextApiRequest, NextApiResponse } from "next"
import { getAccountId, getAccountIdByWhich } from "../../../controllers/Dev/devController";
import { createSuperAdmin } from "../../../controllers/user/auth";

/**
 * @description helpers function
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */


export default async function helpers(req, res) {

    try {
        const { method } = req;
        const params = req.query.params[0];

        if(params==="accountId" && method==="GET"){
            const { error, status, payload } = await getAccountId(req, res);
            res.status(status).json(error || payload);
        }
        else if(params==="accountIdByWhich" && method==="GET"){
            const { error, status, payload } = await getAccountIdByWhich(req, res);
            res.status(status).json(error || payload);
        }
        else if(params==="superadmin" && method==="POST"){
            const { error, status, payload } = await createSuperAdmin(req, res);
            res.status(status).json(error || payload);
        }
        else if(params==="pusher" && method==="GET"){
            const PUSHER_APP_ID = process.env.PUSHER_APP_ID;
            const PUSHER_APP_KEY = process.env.PUSHER_APP_KEY;
            const PUSHER_APP_SECRET = process.env.PUSHER_APP_SECRET;
            const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER;
            const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
            const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
            res.status(200).json({ PUSHER_APP_ID, PUSHER_APP_KEY, PUSHER_APP_SECRET, PUSHER_CLUSTER, STRIPE_PUBLIC_KEY, STRIPE_PRIVATE_KEY });
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }

}