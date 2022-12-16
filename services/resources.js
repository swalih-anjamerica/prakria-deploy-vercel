import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import API from "./api";

export const listAllResources = async function (page) {
    return API.get(`/su-admin/resources?page=${page}&limit=10`);
}

export const createNewResource = async function (body) {
    return API.post("/su-admin/resources", body).then(response => response);
}

export const deleteResource = async function (userId) {
    return API.delete(`/su-admin/resources/${userId}`).then(response => {
        toast.success("User Deleted successfully");
        return response;
    })
}

export const editResource = async function (userId, body) {
    return API.put(`/su-admin/resources/${userId}`, body).then(response => {
        toast.success("User updated successfully!");
        return response;
    })
}

export const showResourceById = async function (id) {
    return API.get(`/su-admin/resources/${id}`).then(response => response);
}

export const listProjectManagersService = function (params) {
    const { page = 1 } = params;
    return useQuery(["list-pms", page],
        () => API.get(`/su-admin/list-pm-for-client?page=${page}`),
        {
            select: response => response.data
        }
    );
}

export const assignPMToResoureService = async function (params) {
    // const { } = params;
    return API.post(`/su-admin/new-pm-for-client`, params);
}