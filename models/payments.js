import mongoose from "mongoose";
import "./plans";

const paymentSchema = new mongoose.Schema({
    paid_date: {
        type: Date,
        default: Date.now()
    },
    paid_amount: {
        type: Number,
        required: true
    },
    paid_currency: {
        type: String,
        required: true
    },
    paid_type: {
        type: String,
        required: true,
        enum: ["add_resource", "renew_resource", "init_subscription", "update_subscription", "new_subscription"]
    },
    plan_duration: {
        type: String,
        enum: ["monthly", "yearly", "quarterly"]
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    resource_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    resource_duration: {
        type: String,
        enum: ["7days", "14days", "30days"],
    },
    stripe_payment_id: {
        type: String,
        required: true
    },
    stripe_payment_method_id: {
        type: String,
    },
    stripe_payment_secret: {
        type: String,
        // required: true
    }
})

export default mongoose.models?.payments ? mongoose.models.payments : mongoose.model("payments", paymentSchema);