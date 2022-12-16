import { sendContactUsMsgBoxController } from "../../../../controllers/user/landingPageController";

export default async function handle(req, res) {
    try {
        const method = req.method;
        const params = req.query.params[0];

        if (params == "query-msg" && method == "POST") {
            const { error, payload, status } = await sendContactUsMsgBoxController(req, res);
            res.status(status).json(payload || error);
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }
}