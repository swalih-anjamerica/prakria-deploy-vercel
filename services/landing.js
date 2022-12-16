import API from "./api"

export const sendQueryService = (params) => {
    return API.post("/users/landing/query-msg", params);
}