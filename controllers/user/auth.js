import authValidations from "../../server/validations/auth.validations";
import userService from "../../server/services/user.services";
import accountService from "../../server/services/account.services";
import bcryptUtils from "../../server/utils/bcrypt.utils";
import jwtUtils from "../../server/utils/jwt.utils";
import stripeUtils from "../../server/utils/stripe.utils";

export const doLogin = async function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const { error: validationError } = authValidations.doLogin(req);
            if (validationError) return resolve({ error: validationError, status: 400 });

            const { data: existingUser } = await userService.findUserByEmail(req);
            if (!existingUser) return resolve({ error: "User not found", status: 400 });
            if (existingUser?.payment_completed !== undefined && existingUser?.payment_completed !== null) {
                if (!existingUser?.payment_completed) {
                    return resolve({ error: "User not found", status: 400 });
                }
            }
            const mathcPassword = await bcryptUtils.comparePassword(req.body.password, existingUser.password);
            if (!mathcPassword) return resolve({ error: "User not found", status: 400 });
            const token = jwtUtils.signToken({ id: existingUser._id });
            resolve({ payload: { payload: token, user: existingUser, role: existingUser.role }, status: 200 })
        } catch (e) {
            reject({ error: "Internal server error" })
        }
    })
}


export const createSuperAdmin = function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcryptUtils.createHashPassword(req.body.password, 10);
            const { data, error, status } = await userService.createUser({ ...req.body, role: "super_admin", hashPassword });
            if (error) resolve({ error: error, status: status })
            else resolve({ payload: data, status: status });
        } catch (e) {
            reject({ error: "Internal server error" })
        }
    })
}

export const checkLogedIn = async function (req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const token = req.headers.authorization;
            const ctoken = token.split(" ")[1];
            if (ctoken === "null") return resolve({ payload: { logedin: false, user: null, role: null }, status: 200 })

            const { id } = jwtUtils.verifyToken(ctoken);
            req.query.id = id;
            let { data: user } = await userService.findUserById(req);
            if (!user) return resolve({ payload: { logedin: false, user: null, role: null }, status: 200 })
            if (user.payment_completed !== null && user.payment_completed !== undefined) {
                if (!user.payment_completed) return resolve({ payload: { logedin: false, user: null, role: null }, status: 200 })
            }

            req.user = user;
            const { data: accountDetails } = await accountService.findAccountFromUser(req);
            user["account_details"] = accountDetails;

            let subscriptionStatus = null;
            let subscription = null;
            if (accountDetails?.active_plan?.subscription_id) {
                const subscriptionRetrive = await stripeUtils.retriveSubscription({ id: accountDetails?.active_plan?.subscription_id });
                subscription = subscriptionRetrive;
                subscriptionStatus = subscriptionRetrive.status;
            }
            resolve({ payload: { logedin: true, user: user, role: user.role, subscriptionStatus: subscriptionStatus, subscription }, status: 200 });

        } catch (e) {
            resolve({ payload: { logedin: false, user: null, role: null }, status: 200 });
        }
    })
}