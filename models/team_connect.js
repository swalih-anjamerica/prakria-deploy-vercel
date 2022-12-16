import mongoose from "mongoose";

const teamConnectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    users: [
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            joined_date: {
                type: Date,
                default: Date.now()
            }
        }
    ]
}, {
    timestamps: true
})

export default mongoose?.models?.team_connect ? mongoose?.models?.team_connect : mongoose.model("team_connect", teamConnectSchema);