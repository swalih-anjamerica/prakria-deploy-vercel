import jsonwebtoken from "jsonwebtoken";
import { JSON_SECRET } from "../../constants/env.constants";

const signToken = (params) => {
    const token = jsonwebtoken.sign(params, JSON_SECRET, {
        expiresIn: 2678400000 // 31 days
    })

    return token;
}

const verifyToken = (token) => {
    const verifyValue = jsonwebtoken.verify(token, JSON_SECRET);
    return verifyValue;
}

const utils = {
    signToken,
    verifyToken
}

export default utils;