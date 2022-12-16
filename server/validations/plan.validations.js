import mongoose from "mongoose";

const createNewPlan = async (req) => {
    let { title, description, features, has_creative_director = false, has_project_manager = true, resources, storage, start_date, end_date, duration } = req.body;
    if (!title) return { error: "title required", status: 400 };
    if (!description) return { error: "description required", status: 400 };
    if (!features) return { error: "features required", status: 400 };
    if (!resources) return { error: "resources required", status: 400 };
    if (!features instanceof Array) return { error: "features should be array", status: 400 };
    if (!resources instanceof Array) return { error: "resources should be array", status: 400 };

    if (typeof has_project_manager !== "boolean") return { error: "has_project_manager should be boolean", status: 400 };
    if (typeof has_creative_director !== "boolean") return { error: "has_creative_director should be boolean", status: 400 };

    if (isNaN(storage)) return { error: "storage should be number", status: 400 };

    if (duration.length > 3) return { error: "only 3 duration", status: 400 };

    return {};
}

const updatePlan = async (req) => {
    const { planId } = req.query;
    if (!planId) return { error: "PlanId required", status: 400 };
    if (!mongoose.isValidObjectId(planId)) return { error: "invalid id", status: 400 };
    return {};
}

const validations = {
    createNewPlan,
    updatePlan
}

export default validations;