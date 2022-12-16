import skillServices from "../../server/services/skills.services";

export const createSkill = async function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const { data: skill } = await skillServices.createSkill({ ...req.body });
            resolve({ payload: skill, status: 200 });
        } catch (e) {
            reject(e);
        }
    })
}

export const showSkills = async function (req, res) {

    return new Promise(async (resolve, reject) => {
        try {
            const skillId = req?.query?.params[1];
            const { data: skills, status } = await skillServices.listSkills({ skillId });
            resolve({ payload: skills, status });
        } catch (e) {
            reject(e);
        }
    })
}


export const deleteSkill = async function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const skillId = req.query?.params[1];


            // checking the skill already asigned to any resource!
            let hasSkill = await skillServices.checkSkillAlreadyAssignedToUser({ skillId });
            if (hasSkill) return resolve({ payload: { message: "The skill already assigned to some users." }, status: 202 });

            // checking that any client bought that resource
            hasSkill = await skillServices.checkResourceBoughtSkill({ skillId });
            if (hasSkill) return resolve({ payload: { message: "The skill has already bought by some users." }, status: 202 });

            const { data, status } = await skillServices.deleteSkill({ skillId });

            return resolve({ payload: data, status });

        } catch (e) {
            reject(e);
        }
    })
}