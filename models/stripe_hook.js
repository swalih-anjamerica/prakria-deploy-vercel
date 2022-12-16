import mongoose from "mongoose";

const stripeHookSchema = new mongoose.Schema({
    
}, {
    timestamps:true
})

export default mongoose?.models?.stripe_log ? mongoose?.models?.stripe_log : mongoose.model("stripe_log", stripeHookSchema);