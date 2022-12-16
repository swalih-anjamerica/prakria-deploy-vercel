import API from "./api"

export const listAllClients = async (search_text, page) => {
    return API.get(`/su-admin/clients?search_text=${search_text}&page=${page}`);
}

export const getClientAllDetails = async (client_id) => {
    return API.get(`/su-admin/client/${client_id}`);
}