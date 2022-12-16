import AuthToken from "../../models/auth_tokens";
import crypto from "crypto";
import { JSON_SECRET } from "../../constants/env.constants";

const createAuthToken = async (params) => {
    try {
        const { value, client_member_id, client_admin_id } = params;
        const authHash = crypto.createHmac("sha256", JSON_SECRET)
            .update(value)
            .digest("hex");
        const createToken = await AuthToken.create({
            body: {
                client_member_id,
                client_admin_id
            },
            auth_token: authHash
        })
        return {
            data: createToken,
            status: 400
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const getAuthToken = (params) => {
    try {
        // const {}=await AuthToken.findOne({});
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const deleteAuthToken = async (params) => {
    try {
        const { auth_token } = params;
        await AuthToken.deleteOne({ auth_token });
        return {
            data: {},
            status: 200
        }
    } catch (e) {
        return {
            error: e.errors || e.message,
            status: 400
        }
    }
}

const authTokenService = {
    createAuthToken,
    deleteAuthToken,
    getAuthToken
}

export default authTokenService;