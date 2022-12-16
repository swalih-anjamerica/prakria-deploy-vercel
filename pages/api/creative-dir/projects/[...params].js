import { listProjectsForCRController } from "../../../../controllers/creative_director/projectControllerCrDir";
export default async function handler(req, res) {
    try {
        const method = req.method;
        const params = req.query?.params[0];
        if (params === "list" && method === "GET") {
            const { error, payload, status } = await listProjectsForCRController(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }
}