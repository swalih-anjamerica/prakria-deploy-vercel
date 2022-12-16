import planService from "../../server/services/plan.services";
import planValidations from "../../server/validations/plan.validations";

export const createNewPlan = function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {

            const { error: validationError } = await planValidations.createNewPlan(req);
            if (validationError) return resolve({ error: validationError, status: 400 });

            const { data: planCreate, status, error } = await planService.createPlan(req);

            if (error) resolve({ error: error, status: status })
            else resolve({ payload: planCreate, status: status })

        } catch (e) {
            return reject(e)

        }
    })

}
export function listPlan(req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, status, error } = await planService.listPlan({...req.query});
            if (error) resolve({ error: error, status: status })
            else resolve({ payload: data, status: status })
        } catch (e) {
            reject({ error: "Internal server error for fetching plans" })
        }
    })
}

export const updatePlan = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { error: validationError } = await planValidations.updatePlan(req);
            if (validationError) return resolve({ error: validationError, status: 400 });

            const { data, status, error } = await planService.updatePlan(req);
            if (error) resolve({ error: error, status: status })
            else resolve({ payload: data, status: status })
        } catch (e) {
            reject(e);
        }
    })
}
