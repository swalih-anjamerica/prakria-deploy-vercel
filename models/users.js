import mongoose, { mongo } from "mongoose";

const settingsSchema=new mongoose.Schema({
    status_notification:{
        type:Boolean,
        default:true
    },
    email_notification:{
        type:Boolean, 
        default:true
    },
    auto_renewl:{
        type:Boolean, 
        default:true
    },
    chat_notification:{
        type:Boolean, 
        default:true
    }
})

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    mobile_number: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ["admin", "project_manager", "designer", "super_admin", "client_admin", "client_member", "creative_director"]
    },
    available: {
        type: Boolean,
        default: true
    },

    designation: {
        type: String,
        required: false,
    },
    skills: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "skills"
        }
    }],
    is_verified: {
        type: Boolean,
        default: false
    },
    time_zone: {
        type: String
    },
    payment_completed:{
        type:Boolean
    },
    settings:{
        type:settingsSchema, required:true, default:{}
    }
}, {
    timestamps: true
})


export default mongoose.models?.users ? mongoose.models.users : mongoose.model("users", userSchema);