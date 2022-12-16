import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    type: {
        type: String,
        required: true
    },
    is_read: {
        type: Boolean,
        default: false
    },
    is_seen: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    path: {
        type: String
    },
    message: {
        type: String,
        required: true
    }
})

export default mongoose.models?.notifications ? mongoose.models?.notifications : mongoose.model("notifications", notificationSchema);