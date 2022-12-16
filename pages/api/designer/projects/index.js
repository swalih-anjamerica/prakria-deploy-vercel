import { listProjectsForDesignersController } from "../../../../controllers/designer/designerProjectController";


export default async function handler(req, res) {
    try {
        const method = req.method;
        if (method === "GET") {
            const { status, error, payload } = await listProjectsForDesignersController(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }
}
