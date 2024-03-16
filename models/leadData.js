import mongoose from "mongoose"

const lead = new mongoose.Schema({
    leadId: {
        type: String,
        default: ""
    },

}, {
    versionKey: false,
})
const leadModel = mongoose.model("lead", lead)
export default leadModel 