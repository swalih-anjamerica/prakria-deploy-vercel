import API from "./api";

export const getAllChats = async (project_id, project_code, page) => {
    return API.get(`/users/chat/${project_id}?chat_code=${project_code}&page=${page}`);
}

export const sendChatMessage = async (project_code, projectId, message, socketId, type) => {
    const body = {
        projectId,
        message,
        socketId,
        type
    }
    return await API.post("/users/chat?chat_code=" + project_code, body);
}

export const chatSceneService=async(params)=>{
    return API.put("/users/chat", params);
}