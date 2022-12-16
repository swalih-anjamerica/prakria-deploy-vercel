import mongoose from "mongoose";
import projects from "./projects";

const revisionSubSchema = new mongoose.Schema({
    comment_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    comment_text: {
        type: String,
        required: true
    },
    position_x: {
        type: Number,
        required: true
    },
    position_y: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        default: Date.now()
    },
    video_mark_time: {
        type: Number,
        default: 0
    }
})


const historySubSchema = new mongoose.Schema({
    resource_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    start_time: {
        type: Date,
        default: Date.now()
    },
    end_time: {
        type: Date
    },
})

const revisionSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
        required: true
    },
    rivision_file: {
        type: String,
        // required: true
    },
    file_size: {
        type: Number,
    },
    resource_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    revision_start_time: {
        required: true,
        type: Date
    },
    title: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        default: Date.now()
    },
    end_time: {
        type: Date
    },
    rivision_status: {
        type: String,
        default: "in_progress",
        enum: ["in_progress", "u_review", "u_approval", "completed", "cancelled", "to_be_confirmed", "on_hold", "client_rejected", "prakria_rejected", "client_commented", "prakria_commented"]
    },
    comments: [revisionSubSchema],
    history: [historySubSchema]
})



export default mongoose.models?.rivisions ? mongoose.models.rivisions : mongoose.model("rivisions", revisionSchema)