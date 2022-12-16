import projectControllerPm from "../../../controllers/project_manager/projectControllerPm";
import authMiddleware from "../../../server/middlewares/auth.middleware";


export default async function handler(req,res){
    try{
        await authMiddleware.authUser(req);
        const method=req.method;
        const params=req.query.params[0];

        if(params==="project" && method==="PUT"){
            const { error, payload, status } = await projectControllerPm.editProjectDetails(req, res);
            res.status(status).json(error||payload);
        }
    }catch(e){
        res.status(e.status||500).json({ error: e.error || e.message });
    }
}