import mongoose from "mongoose";

const skillPriceDurationSubSchema = new mongoose.Schema({
    duration_name: {
        type: String,
        enum: ["7days", "14days", "30days"],
        required: true
    },
    amount: [
        {
            amount: {
                type: Number,
                required: true,
                min: 0
            },
            currency: {
                type: String,
                required: true
            }
        }
    ]
})
const skillSchema = new mongoose.Schema({
    skill_name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    pricing: [skillPriceDurationSubSchema]
}, {
    timestamps: true
})


export default mongoose.models?.skills ? mongoose.models.skills : mongoose.model("skills", skillSchema);