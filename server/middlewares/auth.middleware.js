import jwtUtils from "../utils/jwt.utils";
import User from "../../models/users";

const authUser = (req, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = req.headers?.authorization;
            if (!token) return reject({ status: 404, error: "Unathorized" });
            const ctoken = token.split(" ")[1];
            if (ctoken === "null") return reject({ status: 404, error: "Unathorized" });

            const { id } = jwtUtils.verifyToken(ctoken);
            const user = await User.findOne({ _id: id });

            if (!user) return reject({ status: 404, error: "Unathorized" });

            if (
                role
                && !(role instanceof Array)
                && user.role !== role
            ) return reject({ status: 404, error: "Unathorized" });

            if (
                (role instanceof Array)
                && role[0]
                && !role.includes(user.role)
            ) {
                return reject({ status: 404, error: "Unathorized" });
            }

            req.user = user;
            resolve();
        } catch (e) {
            reject({ status: 404, error: "Unathorized" });
        }
    })
}

const authMiddleware = {
    authUser
}

export default authMiddleware;