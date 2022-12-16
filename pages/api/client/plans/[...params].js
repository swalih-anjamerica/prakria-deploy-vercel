import { listPlansClientService, updateClientSubscriptionComplete } from "../../../../controllers/client/planController";
import authMiddleware from "../../../../server/middlewares/auth.middleware";

export default async function handler(req, res) {
    const method = req.method;
    const params = req.query.params[0];
    try {
        await authMiddleware.authUser(req, ["client_member", "client_admin"])

        if (params === "list" && method === "GET") {
            const { error, payload, status } = await listPlansClientService(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "new-subscription" && method === "POST") {
            const { error, payload, status } = await updateClientSubscriptionComplete(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }
}