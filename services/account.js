import API from "./api";


const services = {
    addClientMember: async (client_id, first_name, last_name, designation, email) => {
        if (!client_id || !first_name || !last_name || !designation || !email) {
            throw new Error("all parameters required.");
        }

        const body = {
            client_id,
            first_name,
            last_name,
            designation,
            email
        }
        return API.post("/client/members", body).then(response => response);
    },

    completeClientMemberSignup: async (client_admin_id, client_member_id, client_member_password, auth_token) => {

        if (!client_admin_id || !client_member_id || !client_member_password || !auth_token) {
            throw new Error("all parametes required.")
        }

        const body = {
            client_admin_id, client_member_id, client_member_password, auth_token
        }
        return API.put("/client/members", body).then(response => response);
    },

    getAccountIdByUserId: async () => {
        return API.get('/dev/accountId')
    },

    getUserAccountDetails: async () => {
        return API.get("/client/account");
    },

    sendClientVerificationEmailService: async (client_id) => {
        return API.post("/client/account-verify-email-send", { client_id })
    },

    verifyClientEmailService: async (auth_token) => {
        return API.post("/client/account-verify", { auth_token })
    },

    listAddResouceSkillService: async (page, search) => {
        return API.get(`/client/account/list-add-resource-skill?page=${page}&search=${search}`);
    },

    addNewResourceService: async (skill_id, duration, stripe_payment_id, paymentData) => {
        return API.post("/client/account/add-resource", {
            skill_id, duration, stripe_payment_id, paymentData
        })
    },

    changeUserPasswordService: async (current_password, new_password) => {
        const body = { current_password, new_password };
        return API.post("/client/account/change-password", body);
    },

    checkResourceExpiryService: async () => {
        return API.get("/client/account/check-resource-expiry");
    },

    forgotPasswordLinkSendService: async (email) => {
        return API.post("/client/account/forgot-password-link", { email });
    },

    forgotPasswordResetService: async (user_id, new_password, token) => {
        return API.put("/client/account/reset-password", { user_id, new_password, token });
    },
}

export const clientPreferenceService = async (key, value) => {
    return API.put("/client/account/settings", { key, value });
}
export const renewResourceService = async (skill_id, duration, currExpirTime, paymentData) => {
    return API.post("/client/account/renew-resource", { skill_id, duration, currExpirTime, paymentData })
}

export default services;