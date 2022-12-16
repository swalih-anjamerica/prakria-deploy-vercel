import Plans from "../../models/plans";
import CustomError from "../lib/customError.lib";
import stripeUtils from "../utils/stripe.utils";

const createPlan = async (req) => {
    try {
        let { title, description, features, has_creative_director = false, has_project_manager = true, resources, storage, start_date, end_date, duration } = req.body;
        let stripeProduct = await stripeUtils.createProduct({ title });
        let modifiedDuration = await stripeUtils.createPricesWithPlanDuration(duration, stripeProduct);
    
        const planCreate = await Plans.create({
            stripe_product_id: stripeProduct.id,
            title,
            description,
            features,
            has_creative_director,
            has_project_manager,
            resources,
            storage,
            start_date: start_date || new Date(),
            end_date,
            duration: modifiedDuration,
        })

        return {
            data: planCreate,
            status: 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const listPlan = async (params) => {
    try {
        const { planId } = params;
        if (planId) {
            const plan = await Plans.findOne({ _id: planId });
            return {
                data: plan,
                status: plan ? 200 : 201
            }
        }
        return {
            data: [],
            status: 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const listPlans = async (params) => {
    try {
        const { showActive } = params;
        let query = {};
        // if(showActive){
        //     plans = await Plans.find({ active: true })
        // }
        if (showActive) {
            query = [
                {
                    $match: {
                        active: true
                    }
                }
            ]
        }
        query = [...query,
        {
            $lookup: {
                from: "skills",
                localField: "resources.skill_id",
                foreignField: "_id",
                as: "skills"
            }
        }]
        let plans=await Plans.aggregate(query);
        return {
            data: plans,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const updatePlan = async (req) => {
    try {
        let { title, description, features, has_creative_director, has_project_manager, resources, storage, active, start_date, end_date, monthlyAmount, quaterlyAmount, yearlyAmount } = req.body;
        const { planId } = req.query
        const activeCount = await Plans.find({ active: true }).count()

        if (active && activeCount >= 3) {
            return { error: "Three Plan Already Active", status: 400 };
        }

        const planDetails = await Plans.findOne({ _id: planId });
        const duration = await stripeUtils.updateChangePlanAmounts(planDetails, monthlyAmount, yearlyAmount, quaterlyAmount)

        const updated = await Plans.updateOne({ _id: planId }, {
            $set: {
                title,
                description,
                features,
                active,
                has_creative_director,
                has_project_manager,
                resources,
                storage,
                start_date,
                end_date,
                duration
            }
        })
        return {
            data: updated,
            status: 200
        }
    } catch (e) {
        throw new CustomError(e.errors || e.message, 400);
    }
}

const planService = {
    createPlan,
    listPlan,
    updatePlan,
    listPlans
}

export default planService;