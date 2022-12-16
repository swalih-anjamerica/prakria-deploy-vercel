import API from "./api";

const rivisionService = {

    /**
     * 
     * @param {string} project_id 
     * @param {string} title 
     * @param {string} resource_id 
     * @param {string} rivision_file 
     */
    createNewRivision: async (project_id, title, resource_id, rivision_file) => {
        const body = {
            project_id,
            title,
            resource_id,
            rivision_file
        }

        return API.post('/users/rivision/create-revision', body);
    },

    /**
     * @description get rivision of a project
     * @param {string} projectId 
     * @returns 
     */
    getRivisionByProjectId: async (projectId) => {
        return API.get(`/users/rivision/list/${projectId}`);
    },

    /**
     * 
     * @param {string} rivisionId 
     */
    getRivisionByRivisionId: async (rivisionId) => {
        return API.get(`/users/rivision/list-one/${rivisionId}`)
    },

    /**
     * @description mark comment in rivision
     * @param {string} rivision_id 
     * @param {string} comment_user_id 
     * @param {string} comment_text 
     * @param {number} position_x 
     * @param {number} position_y 
     */
    addCommentInRivision: async (params) => {


        return API.put('/users/rivision/add-comment', params);
    },

    /**
     * @description list all designers
     * @returns 
     */
    listResources: async (skill_type, page, limit, search_text) => {
        return API.get(`/users/rivision/list-resource?page=${page}&limit=${limit}&search_text=${search_text}&skill_type=${skill_type}`)
    },

    /**
     * @description update a resource in revision
     */
    updateResource: async (revision_id, resource_id) => {
        const body = {
            revision_id, resource_id
        }
        return API.post(`/users/rivision/update-resource`, body);
    }
    ,
    /**
     * @description check incomplete revison exist or not
     */
    checkIncompleteRivision: async (project_id) => {
        return API.get(`/users/rivision/check-incompleted/${project_id}`)
    },

    /**
     * @description add file to revision
     */
    addRevisionFileService: async (revision_id, rivision_file, file_size) => {
        return API.post(`/users/rivision/upload-file`, {
            revision_id,
            rivision_file,
            file_size
        })
    },

    updateRevisionService: async (rivision_file, resource_id, title, start_time, end_time, rivision_status, revision_id) => {
        const body = {
            rivision_file, resource_id, title, start_time, end_time, rivision_status, revision_id
        }
        return API.post(`/users/rivision/update-revision`, body);
    },

    approveRevisionPMService: async (revision_id) => {
        return API.put(`/users/rivision/approve-prakria`, { revision_id })
    },

    declinePrakriaRevisionService: async (revision_id) => {
        return API.put(`/users/rivision/decline-prakria`, { revision_id })
    },

    approveClientRevisionService: async (revision_id) => {
        return API.put(`/users/rivision/approve-client`, { revision_id })
    },

    declieClientRevisionService: async (revision_id) => {
        return API.put(`/users/rivision/decline-client`, { revision_id })
    },

    checkClientRejectedService: async (project_id, revision_id) => {
        return API.get(`/users/rivision/check-client-rejected?projectId=${project_id}&revisionId=${revision_id}`)
    },

    holdRevisionCreDirService: async (revision_id) => {
        return API.put(`/users/rivision/hold-revision?revision_id=${revision_id}`)
    },

    unHoldRevisionCreDirService: async (revision_id) => {
        return API.put(`/users/rivision/un-hold-revision?revision_id=${revision_id}`);
    },

    deleteCommentService: async (mark_id, revision_id) => {
        return API.post(`/users/rivision/delete-comment?mark_id=${mark_id}&revision_id=${revision_id}`)
    },

    deleteRevisionFileService:async(params)=>{
        return API.put(`/users/rivision/delete-file`, params);
    }
}


export default rivisionService;