import { NextApiRequest, NextApiResponse } from "next";
import Duration from "../../models/durations";

/**
 * @method POST
 * @description Controller for create new duration for plan
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */
export const createNewDuration = function (req, res) {
    
    return new Promise(async (resolve, reject) => {
        try {
            let { duration_name, duration_id } = req.body;

            // validation
            if (!duration_name) {
                return resolve({ error: "duration_name must be required!", status: 400 });
            }
            duration_name = (duration_name.trim()).toLowerCase()
            if (!duration_id) {
                return resolve({ error: "duration_id must be required!", status: 400 });
            }

            if (!/|weekly|monthly|yearly|quarterly/i.test(duration_name)) {
                return resolve({ error: "Duration values must be  weekly,monthly,duration,yearly", status: 400 });

            }
            if (!isNaN(duration_name)) {
                return resolve({ error: "Duration must be string", status: 400 });
            }
            if (duration_name.length < 4 || duration_name.length > 10) {
                return resolve({ error: "duration limit exceed or less", status: 400 });
            }

            const isExist = await Duration.exists({ $or: [{ duration_name: duration_name }, { duration_id: duration_id }] })
            if (isExist) {
                return resolve({ error: "duration name or duration id exist already", status: 400 });

            }
            // create plan
            const createDuration = await Duration.create({
                duration_name,
                duration_id
            })

            return resolve({ payload: createDuration, status: 200 })



        } catch (e) {
            
            return reject(e)

        }
    })

}

export const listDuration = ((req, res) => {

    return new Promise(async(resolve, reject) => {



        try {

            const response = await Duration.find({})

            if(!response.length){
                return resolve({ error: "NO data here", status: 204 });

            }
            return resolve({ payload: response, status: 200 })


            

        } catch (error) {
            (error);
            return reject(error)

        }
    })



})
