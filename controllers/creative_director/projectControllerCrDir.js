import projectService from "../../server/services/project.services";

export const listProjectsForCRController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {data, status}=await projectService.listProjectsForCR({...req.query})
            resolve({ payload: { projects:data.projects, total: data.total}, status });
        } catch (e) {
            reject(e);
        }
    })
}