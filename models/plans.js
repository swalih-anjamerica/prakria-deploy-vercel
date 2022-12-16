import mongoose from "mongoose";


const planDurationSubSchema = new mongoose.Schema({
    duration_name:{
        type:String,
        enum:["monthly","yearly","quarterly"],
        required:true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    stripe_price_id: {
        type: String
    }
})

const resourcesSubSchema = new mongoose.Schema({
    skill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skills",
        required: true,
        trim: true
    },
    count: {
        type: Number,
        required: true,
        min: 0,
    }
})




const plansSchema = new mongoose.Schema({
    stripe_product_id: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
        default: new Date(),
        required: true,

    },
    end_date: {
        type: Date,
        // required: true,
    },
    has_creative_director: {
        type: Boolean,
        default: false
    },
    has_project_manager: {
        type: Boolean,
        default: true
    },
    resources: [resourcesSubSchema],
    storage: {
        type: Number,
        default: 0,
        min: 0
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    features: [],
    duration: [planDurationSubSchema]
},
    {
        timestamps: true
    })


export default mongoose.models?.plans ? mongoose.models.plans : mongoose.model("plans", plansSchema);