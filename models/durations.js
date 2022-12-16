import mongoose from "mongoose";


const durationSchema = new mongoose.Schema({
    duration_name: {
        type: String,
        required: true,
        trime: true,
        enum:["weekly","monthly","yearly","quarterly"]
    },
    duration_id: {
        type: String,
        required: true,
        min: 0
    }

})



export default mongoose.models?.durations ? mongoose.models.durations : mongoose.model("durations",durationSchema);