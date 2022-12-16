import jsonwebtoken from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import User from "../models/users";

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 * @returns 
 */
export const validateJWTToken = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = req.headers?.authorization;
      if (!token) {
        return resolve({ status: 404, error: "Unathorized", user: null });
      }
      const ctoken = token.split(" ")[1];
      if (ctoken === "null") {
        return resolve({ status: 404, error: "Unathorized", user: null });
      }
      const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);
      const user = await User.findOne({ _id: id });
      if (!user) {
        return resolve({ status: 404, error: "Unathorized", user: null });
      }
      resolve(user);
    } catch (e) {
      console.log(e.message);
      resolve({ status: 404, error: "Unathorized", user: null });
    }
  });
};
