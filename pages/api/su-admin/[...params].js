import { NextApiRequest, NextApiResponse } from "next";
import { createSkill, deleteSkill, showSkills } from "../../../controllers/superadmin/skills";
import { createResource, deleteUser, editUser, listResources } from "../../../controllers/superadmin/resources";
import { assingNewPMToClientController, getDetailsOfOneClient, joinOurTeamFormController, listAllClients, listProjectManagers, requestQuoteEmailController } from "../../../controllers/superadmin/clients";
import authMiddleware from "../../../server/middlewares/auth.middleware";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export default async function handler(req, res) {
    const params = req.query.params[0];
    const method = req.method;

    try {
        await authMiddleware.authUser(req);
        if (params === "skill" && method == "GET") {
            const { error, payload, status } = await showSkills(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (params === "skill" && method == "POST") {
            const { error, payload, status } = await createSkill(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (params === "skill" && method == "DELETE") {
            const { error, payload, status } = await deleteSkill(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (params === "resources" && method == "GET") {
            const { error, payload, status } = await listResources(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (params === "resources" && method == "POST") {
            const { error, payload, status } = await createResource(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (params === "resources" && method == "DELETE") {
            const { error, payload, status } = await deleteUser(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (params === "resources" && method == "PUT") {
            const { error, payload, status } = await editUser(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (params === "clients" && method == "GET") {
            const { error, payload, status } = await listAllClients(req, res);
            res.status(status).json(error ? { error } : payload);
        }
        else if (params === "client" && method == "GET") {
            const { error, payload, status } = await getDetailsOfOneClient(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "list-pm-for-client" && method == "GET") {
            const { error, payload, status } = await listProjectManagers(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "new-pm-for-client" && method == "POST") {
            const { error, payload, status } = await assingNewPMToClientController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "request-quote-mail" && method == "POST") {
            const { error, payload, status } = await requestQuoteEmailController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "join-our-team" && method == "POST") {
            const { error, payload, status } = await joinOurTeamFormController(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(e.status || 500).json({ error: e.error || e.message })
    }
}