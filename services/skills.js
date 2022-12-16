import API from "./api";

export const listSkills = async (skill_id) => {
    if (skill_id) {
        return API.get(`/su-admin/skill/${skill_id}`)
    }
    return API.get("/su-admin/skill").then(response => response);
}

export const createSkill = async (skill_name, description) => {
    return API.post("/su-admin/skill", { skill_name, description }).then(response => response);
}

export const deleteSkill = async (skillId) => {
    return API.delete(`/su-admin/skill/${skillId}`).then(response => {
        return response;
    })
}