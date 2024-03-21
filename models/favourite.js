import mongoose from "mongoose";

const favourite = new mongoose.Schema({
    userId: {
        type: String,
        default: ""
    },
    leadId: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false
})

const favouriteModel = mongoose.model("favourite", favourite)
export default favouriteModel 