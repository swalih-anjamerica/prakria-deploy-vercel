import mongoose from "mongoose";
import './accounts'


const fileSchema = new mongoose.Schema({
    folder: {
        type: String,
        required: true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    filekey: {
        type: String,
        required: true,
    },
    filename: {
        type: String,

    },
    folderId: {
        type: String,
    },
    size: {
        type: Number
    },
    date: {
        type: Date,
        default: new Date()
    }
}, {
    timestamps: true
})


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    folder: {
        type: Array,
        uppercase: true,
        default: ["GUIDELINES", "ASSETS", "LOGO", "COLOURS"]
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'accounts'
    },
    files: [fileSchema]
}, {
    timestamps: true
})

export default mongoose.models?.brands ? mongoose.models.brands : mongoose.model("brands", brandSchema)
