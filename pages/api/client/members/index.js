import clientAccount from "../../../../controllers/client/account";
import authMiddleware from "../../../../server/middlewares/auth.middleware";

export default async function hander(req, res) {
    try {
        // await authMiddleware.authUser(req, "client_admin");
        const method = req.method;
        if (method === "GET") {
            const { error, status, payload } = await clientAccount.listClientMembers(req, res);
            res.status(status).json(error || payload);
        }
        else if(method==="POST"){
            const { error, status, payload } = await clientAccount.addNewMember(req, res);
            console.log(error, status, payload);
            res.status(status).json(error || payload);
        }
        else if(method==="PUT"){
            const { error, status, payload } = await clientAccount.completeClientMemberSignup(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(e.status||500).json({error:e.message});
    }
}