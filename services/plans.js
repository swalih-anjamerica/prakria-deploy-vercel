import API from "./api";



export const listAllPlans = async (id) => {

    if (id) {
        return API.get(`/admin/plans?planId=${id}`).then(response => {
            return response
        });
    } else {
        return API.get(`/admin/plans`).then(response => {
            return response
        });
    }


}


export const createNewPlan = async (body) => {
    return API.post("/admin/plans", body).then(response => response);
}


export const updatePlan = async (body, planId) => {
    if (!planId) return alert("something went wrong in Plan")
    return API.put(`/admin/plans?planId=${planId}`, body).then(response => response)
}


export const listClientActivePlan = async () => {
    return API.get("/client/plan")
}


export const listUpgradePlansService = async () => {
    return API.get("/client/plans/list");
}

export const updateClientSubscriptionDBService = async (plan_id, plan_duration, subscription_id, paymentData) => {
    return API.post("/client/plans/new-subscription", { plan_id, plan_duration, subscription_id, paymentData });
}