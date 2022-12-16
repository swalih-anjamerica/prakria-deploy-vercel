import { completeAccDetailsNotfnController, deleteNotificationController, expiryNtfnController, listNotificationsController, markAllNotificationController, needAnyAssNtfyController, prakriaCompleteAccountNtryController, readNotificationController, seenAllNotificationController } from "../../../../controllers/user/notificationController";


export default async function hander(req, res) {
    try {
        const params = req.query.params[0];
        const method = req.method;
        if (params === "read" && method === "PUT") {
            const { error, payload, status } = await readNotificationController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "seen-all" && method === "POST") {
            const { error, payload, status } = await seenAllNotificationController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "read-all" && method === "PUT") {
            const { error, payload, status } = await markAllNotificationController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "notify-incomplete-company-client" && method === "POST") {
            const { error, payload, status } = await completeAccDetailsNotfnController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "notify-assistant" && method === "POST") {
            const { error, payload, status } = await needAnyAssNtfyController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "prakria-incomplete-account" && method === "POST") {
            const { error, payload, status } = await prakriaCompleteAccountNtryController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "plan-expiry-ntfn" && method === "POST") {
            const { error, payload, status } = await expiryNtfnController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "delete" && method === "DELETE") {
            const { error, payload, status } = await deleteNotificationController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "list" && method === "GET") {
            const { error, payload, status } = await listNotificationsController(req, res);
            res.status(status).json(payload || error);
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }
}