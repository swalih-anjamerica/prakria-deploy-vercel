import mongoose from "mongoose";

const sceneUserSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId
    },
    seen_at:{
        type:Date,
        default:Date.now()
    }
})

const chatSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    room_id: {
        required: true,
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_role: {
        type: String,
        required: true,
        enum: ["admin", "project_manager", "designer", "super_admin", "client_admin", "client_member", "creative_director"]
    },
    created_time: {
        type: Date,
        default: Date.now()
    },
    message: {
        type: String,
        required: true
    },
    message_type: {
        type: String,
        required: true
    },
    seen:[sceneUserSchema]
})

export default mongoose?.models?.chats ? mongoose?.models?.chats : mongoose.model("chats", chatSchema);