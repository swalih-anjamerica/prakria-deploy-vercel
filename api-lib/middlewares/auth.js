import jsonwebtoken from "jsonwebtoken";
import next, { NextApiRequest, NextApiResponse } from "next";
import User from '../../models/users'
/**
 * @method Middleware
 * @description To authorize user
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 * @param {import("next").NextApiHandler}
 */


export const isAuthorize = async (req, res, next) => {

    try {
        const token = req.headers.authorization;

        if (!token) return res.status(401).json("No authorization Token")

        const ctoken = token.split(" ")[1];
        if (ctoken === "null") return res.status(401).json("No authorization Token")

        const { id } = jsonwebtoken.verify(ctoken, process.env.JSON_SECRET);

        const user = await User.findOne({ _id: id })

        if (!user) return res.status(401).json("No user found")
        next()

    } catch (error) {
        if (error?.name==="JsonWebTokenError") return  res.status(401).json({error})
        res.status(500).json({error:"Internal server error in listing brands"})
    }
             
}