import accountController from "../../../../controllers/client/account";

export default async function handler(req, res) {
    try {
        const params = req.query.params[0];
        const method = req.method;

        if (params === "add-resource" && method === "POST") {
            const { error, payload, status } = await accountController.addResourceToClientController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "list-add-resource-skill" && method === "GET") {
            const { error, payload, status } = await accountController.listAddResourceSkills(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "change-password" && method === "POST") {
            const { error, payload, status } = await accountController.changeUserPasswordController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "check-resource-expiry" && method === "GET") {
            const { error, payload, status } = await accountController.checkResourceExpiredController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "forgot-password-link" && method === "POST") {
            const { error, payload, status } = await accountController.sendForgotPasswordLinkController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "reset-password" && method === "PUT") {
            const { error, payload, status } = await accountController.completeResetPasswordController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "settings" && method === "PUT") {
            const { error, payload, status } = await accountController.clientPreferenceController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "renew-resource" && method === "POST") {
            const { error, payload, status } = await accountController.renewResourceController(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }
}