import API from "./api"


export const listNotificationService = (params) => {
    const {type, page=1}=params;
    return API.get(`/users/notifications/list?category=${type}&page=${page}`);
}

export const deleteNotificationService = (id) => {
    return API.delete(`/users/notifications/delete?notification_id=${id}`)
}

export const readNotificationService = (id) => {
    return API.put(`/users/notifications/read`, { notification_id: id })
}

export const readAllNotificationService = () => {
    return API.put("/users/notifications/read-all");
}

export const seenAllNotificationService = () => {
    return API.post("/users/notifications/seen-all")
}