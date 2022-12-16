import clientAccount from "../../../../controllers/client/account";

export default async function handler(req, res) {
    try {
        const method = req.method;
        const params = req.query.params[0];

        if (params === "delete" && method === "PUT") {
            const { error, status, payload } = await clientAccount.removeClientMember(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e?.error || e?.message });
    }
}