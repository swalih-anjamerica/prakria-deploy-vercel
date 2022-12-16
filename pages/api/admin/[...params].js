import { createNewDuration, listDuration } from "../../../controllers/admin/duration";
import { createNewPlan, listPlan, updatePlan } from "../../../controllers/admin/plans";
import authMiddleware from "../../../server/middlewares/auth.middleware";

export default async function handler(req, res) {
    const method = req.method;
    const params = req.query.params[0];

    try {
        await authMiddleware.authUser(req, "admin");

        if (params === "plans" && method === "GET") {
            const { error, payload, status } = await listPlan(req, res);
            return res.status(status).json(error ? { error } : payload);
        }
        else if (params === "plans" && method === "POST") {
            const { error, payload, status } = await createNewPlan(req, res);
            return res.status(status).json(error ? { error } : payload);
        }
        else if (params === "plans" && method === "PUT") {
            const { error, payload, status } = await updatePlan(req, res);
            return res.status(status).json(error ? { error } : payload);
        }
        else if (params === "durations" && method === "GET") {
            const { error, payload, status } = await listDuration(req, res);
            return res.status(status).json(error ? { error } : payload);
        }
        else if (params === "durations" && method === "POST") {
            const { error, payload, status } = await createNewDuration(req, res);
            return res.status(status).json(error ? { error } : payload);
        }

    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }
}