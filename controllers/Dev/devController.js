import Account from '../../models/accounts'
import { NextApiRequest, NextApiResponse } from "next"
import jsonwebtoken from 'jsonwebtoken';
import User from "../../models/users";
import Projects from '../../models/projects';
import brands from '../../models/brands';


/**
 * @to get account ID with Headers
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */


export const getAccountId = (req, res) => {


    return new Promise(async (resolve, reject) => {


        try {
            const token = req.headers.authorization;
            if (!token) return resolve({ status: 400, error: "No token here" })
            const ctoken = token.split(" ")[1];


            if (ctoken === "null") {
                return resolve({ payload: { logedin: false, user: {}, role: null }, status: 200 })
            }

            var { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);

            const user = await User.findOne({ _id: id });

            if (!user) {
                return resolve({ error: { error: "unathorized", status: 404 } });
            }

            let findQuery = {
                [
                    user.role === "client_admin" ? "client_admin" :
                        user.role === "client_member" ? "client_members.userId" :
                            user.role === "project_manager" ? "account_manager" :
                                user.role === "designer" && "resources"
                ]: id
            }


            const response = await Account.findOne(findQuery)

            if (!response) return resolve({ status: 200, paylod: { id: null } })
            const data = { id: response.id }
            return resolve({ status: 200, payload: data })

        } catch (error) {
            res.status(400).json({ error })
        }

    })
}


/**
 * @to get account ID with Headers
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 */


export const getAccountIdByWhich = (req, res) => {


    return new Promise(async (resolve, reject) => {

       
        try {

            const { projectId, brandid } = req.query

            if (projectId) {

                const { account_id } = await Projects.findOne({ _id: projectId }).lean()
                const data = { id: account_id }

                return resolve({ status: 200, payload: data })


            }
            if (brandid) {

                const { account_id } = await brands.findOne({ _id: brandid }).lean()
                const data = { id: account_id }
                return resolve({ status: 200, payload: data })


            }

        } catch (error) {
            res.status(400).json({ error })
        }

    })
}

