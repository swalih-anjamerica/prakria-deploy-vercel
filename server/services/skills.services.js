import CustomError from "../lib/customError.lib";
import Skill from "../../models/skills";
import User from "../../models/users";
import Account from "../../models/accounts";

const createSkill = async (params) => {
    try {
        const { skill_name, description } = params;
        const skill = await Skill.create({
            skill_name,
            description,
            pricing: [
                {
                    duration_name: "7days",
                    amount: [
                        {
                            amount: 7,
                            currency: "gbp"
                        }
                    ]
                },
                {
                    duration_name: "14days",
                    amount: [
                        {
                            amount: 14,
                            currency: "gbp"
                        }
                    ]
                },
                {
                    duration_name: "30days",
                    amount: [
                        {
                            amount: 30,
                            currency: "gbp"
                        }
                    ]
                },
            ]
        })
        return {
            data: skill,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const listSkills = async (params) => {
    try {
        const { skillId } = params;
        if (skillId) {
            const skill = await Skill.findOne({ _id: skillId });
            return {
                data: skill,
                status: !skill ? 204 : 200
            }
        }
        const allSkills = await Skill.find({});
        return {
            data: allSkills,
            status: !allSkills[0] ? 204 : 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const deleteSkill = async (params) => {
    try {
        const { skillId } = params;
        if (!skillId) return new CustomError("SkillId not found", 400);
        const deleteSkill = await Skill.deleteOne({ _id: skillId });
        return {
            data: deleteSkill,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const checkSkillAlreadyAssignedToUser = async (params) => {
    try {
        const { skillId } = params;
        if (!skillId) return new CustomError("SkillId not found", 400);
        let isAssigned = await User.exists({ "skills.id": skillId });
        return {
            data: isAssigned ? true : false,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const checkResourceBoughtSkill = async (params) => {
    try {
        const { skillId } = params;
        if (!skillId) return new CustomError("SkillId not found", 400);
        let isAssigned = await Account.exists({ "added_resources.skill_id": skillId });
        return {
            data: isAssigned ? true : false,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const skillServices = {
    createSkill,
    listSkills,
    deleteSkill,
    checkSkillAlreadyAssignedToUser,
    checkResourceBoughtSkill
}

export default skillServices;