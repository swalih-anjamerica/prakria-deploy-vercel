import jsonwebtoken from "jsonwebtoken";
import User from "../../models/users";
import Account from "../../models/accounts";

export function getAccountId(req) {
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
   [user.role === "client_admin" ? "client_admin" : user.role === "client_member" ? "client_members.userId" : user.role === "project_manager" && "account_manager"]: id
            }

            const response = await Account.findOne(findQuery)

            if (!response) return resolve({ status: 200, paylod: { id: null } })
            const data = { id: response.id }
            return resolve({ status: 200, payload: { userId: user._id, accountId: data.id } })

        } catch (error) {
            resolve({ error: error.message, status: 500 })
        }

    })
}