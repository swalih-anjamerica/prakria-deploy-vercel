import mongoose from "mongoose";
import moment from "moment-timezone";

const authTokenSchema = new mongoose.Schema({
    auth_token: {
        type: String,
        required: true
    },
    // createdAt: {
    //     type: Date,
    //     expires:172800, // two days
    //     default: moment().tz("Asia/Calcutta").format()
    // },
    body: {
        type: Object,
        required: true
    }
})

export default mongoose.models?.auth_tokens ? mongoose.models.auth_tokens : mongoose.model("auth_tokens", authTokenSchema);