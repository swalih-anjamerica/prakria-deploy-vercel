import moment from 'moment-timezone'
import mongoose from 'mongoose'
import "./plans";

// ++++++++++++++++++++++++++++ SUB SCHEMA +++++++++++++++++++++++++++++++++++++++++


// const creditCardSubSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     brand: {
//         type: String,
//         required: true
//     },
//     last_4_degit: {
//         type: String,
//         required: true
//     },
//     country: {
//         type: String,
//         required: true
//     },
//     exp_month: {
//         type: String,
//         required: true
//     },
//     exp_year: {
//         type: String,
//         required: true
//     }
// })

const companyAddressSchema = new mongoose.Schema({
    company_name: {
        type: String,
    },
    address: {
        type: String
    },
    pincode: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String
    },
    website: {
        type: String
    },
    taxcode: {
        type: String
    },
    industry: {
        type: String
    }

})


const activePlanSubSchema = new mongoose.Schema({
    subscription_id: {
        type: String
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "plans",
        required: true,
        trim: true
    },
    duration: {
        type: String,
        enum: ["weekly", "monthly", "yearly", "quarterly"],
        required: true
    },
    start_date: {
        type: Date,
        default: moment.tz("Asia/Calcutta").format()
    },
    // end_date: {
    //     type: Date
    // }
})

const planHistorySchema = new mongoose.Schema({
    subscription_id: {
        type: String
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "plans",
        required: true,
        trim: true
    },
    duration: {
        type: String,
        enum: ["weekly", "monthly", "yearly", "quarterly"],
        required: true
    },
    start_date: {
        type: Date,
        default: moment.tz("Asia/Calcutta").format()
    },
    end_date: {
        type: Date,
        required: true
    }
})
const addedResourceSubSchema = new mongoose.Schema({
    skill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skills",
        required: true
    },
    duration: {
        type: String,
        enum: ["7days", "14days", "30days"],
        required: true
    },
    stripe_payment_id: {
        type: String,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
})
const addedResourceHistorySchema = new mongoose.Schema({
    skill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skills",
        required: true
    },
    duration: {
        type: String,
        enum: ["7days", "14days", "30days"],
        required: true
    },
    stripe_payment_id: {
        type: String,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
})
const accountSchema = new mongoose.Schema({
    stripe_customer_id: {
        type: String,
        required: true
    },
    client_admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    // credit_card_details: [creditCardSubSchema],
    company_address: companyAddressSchema,
    active_plan: activePlanSubSchema,
    plan_history: [planHistorySchema],
    added_resources: [addedResourceSubSchema],
    added_resources_history: [addedResourceHistorySchema],
    account_manager: {
        type: mongoose.Types.ObjectId,
        // required: true,
        ref: "users"
    },
    client_members: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }
        }
    ]
})

export default mongoose.models?.accounts ? mongoose.models.accounts : mongoose.model("accounts", accountSchema);




















