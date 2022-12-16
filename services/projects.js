import API from "./api";

const services = {

    /**
     * @description fetch projects according to client id
     * @param {string} account_id 
     * @returns 
     */
    fetchProjectsByAccountId: (account_id, status, search, from, to, isProjectManager, page, fileSort = 1) => {
        if (isProjectManager) {

            if (search && from && status) {
                return API.get(`/users/projects?project_manager=${account_id}&status=${status}&search=${search}&from=${from}&to=${to}&page=${page}&fileSort=${fileSort}`);
            }
            if (search && status) {
                return API.get(`/users/projects?project_manager=${account_id}&status=${status}&search=${search}&page=${page}&fileSort=${fileSort}`);
            }
            if (status && from) {
                return API.get(`/users/projects?project_manager=${account_id}&status=${status}&from=${from}&to=${to}&page=${page}&fileSort=${fileSort}`);
            }
            if (search && from) {
                return API.get(`/users/projects?project_manager=${account_id}&search=${search}&from=${from}&to=${to}&page=${page}&fileSort=${fileSort}`);
            }

            if (status) {
                return API.get(`/users/projects?project_manager=${account_id}&status=${status}&page=${page}&fileSort=${fileSort}`);
            }
            if (search) {
                return API.get(`/users/projects?project_manager=${account_id}&search=${search}&page=${page}&fileSort=${fileSort}`);
            }
            if (from) {
                return API.get(`/users/projects?project_manager=${account_id}&from=${from}&to=${to}&page=${page}&fileSort=${fileSort}`);
            }

            return API.get(`/users/projects?project_manager=${account_id}&page=${page}&fileSort=${fileSort}`);
        }



        if (search && from && status) {
            return API.get(`/users/projects?account_id=${account_id}&status=${status}&search=${search}&from=${from}&to=${to}&page=${page}&fileSort=${fileSort}`);
        }
        if (search && status) {
            return API.get(`/users/projects?account_id=${account_id}&status=${status}&search=${search}&page=${page}&fileSort=${fileSort}`);
        }
        if (status && from) {
            return API.get(`/users/projects?account_id=${account_id}&status=${status}&from=${from}&to=${to}&page=${page}&fileSort=${fileSort}`);
        }
        if (search && from) {
            return API.get(`/users/projects?account_id=${account_id}&search=${search}&from=${from}&to=${to}&page=${page}&fileSort=${fileSort}`);
        }

        if (status) {
            return API.get(`/users/projects?account_id=${account_id}&status=${status}&page=${page}&fileSort=${fileSort}`);
        }
        if (search) {
            return API.get(`/users/projects?account_id=${account_id}&search=${search}&page=${page}&fileSort=${fileSort}`);
        }
        if (from) {
            return API.get(`/users/projects?account_id=${account_id}&from=${from}&to=${to}&page=${page}&fileSort=${fileSort}`);
        }

        return API.get(`/users/projects?account_id=${account_id}&page=${page}&fileSort=${fileSort}`)
    },

    /**
     * 
     * @param {string} projectId 
     */
    fetchProjectDetailsById: (projectId) => {
        if (!projectId) throw Error("projectId required");

        return API.get(`/users/projects/${projectId}`);
    }
}


export default services;