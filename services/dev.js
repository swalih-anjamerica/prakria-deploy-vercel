import API from "./api"

export const getPusherKeysService = () => {
    return API.get("/dev/pusher");
}