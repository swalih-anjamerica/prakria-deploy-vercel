import accounts from "../../models/accounts";
import projectService from "../../server/services/project.services";
import pusherUtils from "../../server/utils/pusher.utils";
import projectNotification from "../../server/notifications/project.notifications";


const editProjectDetails = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const { edit } = req.query;
            const user = req.user;
            const currentDate = new Date();
            const { project_id, estimate_date } = req.body;
            currentDate.setHours(0, 0, 0, 0);
            
            if (!project_id) return resolve({ error: { error: "project_id required.", }, status: 400 });
            if (estimate_date && isNaN(Date.parse(estimate_date))) return resolve({ error: { error: "estimate date should be valid date." }, status: 400 })
            if (estimate_date && new Date(estimate_date) < currentDate) return resolve({ error: { error: "estimate must be future date." }, status: 400 })
            
            const {data:project}= await projectService.updateProject({...req.body});
            pusherUtils.trigger({channel:project_id, event:"project-update"})
            projectNotification.briefEdit({user, project});

            resolve({ payload: { success: true, message: "Project updated successfully." }, status: 200 });
        } catch (e) {
            reject(e);
        }
    })
}

const fetchMyUsers = async (req, res) => {
    try {
        const { id } = req.query
        const userRes = await accounts.find({ account_manager: id }).populate('client_admin').lean()
        res.json(userRes)
    } catch (error) {
    }

}

const projectControllers = {
    editProjectDetails,
    fetchMyUsers
}

export default projectControllers;