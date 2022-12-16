import { NextApiRequest, NextApiResponse } from "next";
import TeamConnect from "../../models/team_connect";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/users";


const createConnectTeam = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const authorization = req.headers?.authorization;
            if (!authorization) {
                return resolve({ error: { error: "Unathorized", code: 401 }, status: 401 });
            }

            const token = authorization.split(" ")[1];
            if (token == "null" || !token) {
                return resolve({ error: { error: "Unathorized", code: 401 }, status: 401 });
            }

            const { id } = jsonwebtoken.verify(token, process.env.JSON_SECRET)

            if (!id) {
                return resolve({ error: { error: "Unathorized", code: 401 }, status: 401 });
            }

            let { users, title } = req.body;
            if (!Array.isArray(users)) {
                return resolve({ error: { error: "The users must be array.", code: 200 }, status: 400 });
            }

            const createGroup = await TeamConnect.create({
                title,
                admin: id,
                users
            })

            resolve({ payload: { success: true, group: createGroup }, status: 200 });
        } catch (e) {
            if (e.errors) {
                resolve({ error: e.errors, status: 400 })
            } else {
                reject({ error: e.message });
            }
        }
    })
}

const listConnectTeams = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const authorization = req.headers?.authorization;
            if (!authorization) {
                return resolve({ error: { error: "Unathorized", code: 401 }, status: 401 });
            }

            const token = authorization.split(" ")[1];
            if (token == "null" || !token) {
                return resolve({ error: { error: "Unathorized", code: 401 }, status: 401 });
            }

            const { id } = jsonwebtoken.verify(token, process.env.JSON_SECRET)
            if (!id) {
                return resolve({ error: { error: "Unathorized", code: 401 }, status: 401 });
            }

            const userDetails = await User.findOne({ _id: id });
            if (!userDetails) {
                return resolve({ error: { error: "User not found", code: 204 }, status: 400 });
            }

            let { page, limit } = req.query;
            if (!page) page = 1;
            if (!limit) limit = 5;


            const teamConnectGroups = await TeamConnect.find({
                $or: [
                    { admin: id },
                    { "users.user_id": id }
                ]
            })
            if (!teamConnectGroups[0]) {
                return resolve({ status: 204 });
            }

            resolve({ payload: teamConnectGroups, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}

const teamConnectConrollers = {
    createConnectTeam,
    listConnectTeams
}

export default teamConnectConrollers