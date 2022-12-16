import { NextApiRequest, NextApiResponse } from "next";
import rivisionController from "../../../../controllers/user/rivisionController";
import authMiddleware from "../../../../server/middlewares/auth.middleware";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function handler(req, res) {
    try {
        const params = req.query.params[0];
        const method = req.method;

        await authMiddleware.authUser(req);

        // method for list resource
        if (params === "list-resource" && method === "GET") {
            const { payload, status, error } = await rivisionController.listResources(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "update-resource" && method === "POST") {
            const { payload, status, error } = await rivisionController.updateRivisonResource(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "check-incompleted" && method === "GET") {
            const { payload, status, error } = await rivisionController.checkPreviousRivisionCompleted(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "list" && method === "GET") {
            const { payload, status, error } = await rivisionController.getAllRivision(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "list-one" && method === "GET") {
            const { payload, status, error } = await rivisionController.getRivisionById(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "list-one" && method === "GET") {
            const { payload, status, error } = await rivisionController.getRivisionById(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "create-revision" && method === "POST") {
            const { payload, status, error } = await rivisionController.addNewRivision(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "update-revision" && method === "POST") {
            const { payload, status, error } = await rivisionController.updateRevisionController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "approve-prakria" && method === "PUT") {
            const { payload, status, error } = await rivisionController.approveProjectManagerRevisionController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "decline-prakria" && method === "PUT") {
            const { payload, status, error } = await rivisionController.declinePrakriaRevisionController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "approve-client" && method === "PUT") {
            const { payload, status, error } = await rivisionController.approveClientRevisionController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "decline-client" && method === "PUT") {
            const { payload, status, error } = await rivisionController.declineClientRevisionController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "add-comment" && method === "PUT") {
            const { payload, status, error } = await rivisionController.addNewComment(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "upload-file" && method === "POST") {
            const { payload, status, error } = await rivisionController.updateRevisionFile(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "delete-comment" && method === "POST") {
            const { payload, status, error } = await rivisionController.deleteCommentController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "check-client-rejected" && method === "GET") {
            const { payload, status, error } = await rivisionController.checkClientRejectedProjectController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "hold-revision" && method === "PUT") {
            const { payload, status, error } = await rivisionController.holdRevisionCreDirController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "un-hold-revision" && method === "PUT") {
            const { payload, status, error } = await rivisionController.unHoldRevisionCreDirController(req, res);
            res.status(status).json(payload || error);
        }
        else if (params === "delete-file" && method === "PUT") {
            const { error, payload, status } = await rivisionController.deleteRevisionFileController(req, res);
            res.status(status || 200).json(error || payload);
        }

    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }
}