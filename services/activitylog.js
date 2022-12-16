import API from "./api"

export const getResourceTimeStampService = (searchDate, searchText, page) => {
    return API.get(`/su-admin/activity-logs/list?page=${page}&search_text=${searchText}&start_date=${searchDate}`);
}