import { doLogin, createSuperAdmin, checkLogedIn } from "../../../controllers/user/auth";


export default async function handler(req, res) {
    const method = req.method;

    try {
        if (method === "GET") {
            const { error, status, payload } = await checkLogedIn(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (method === "POST") {
            const { error, status, payload } = await doLogin(req, res);
            res.status(status).json(error ? { error } : payload);
        }
    } catch (e) {
        res.status(500).json({ error: e?.error });
    }
}