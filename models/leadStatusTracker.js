import mongoose from "mongoose"

const leadStatus = new mongoose.Schema({
    leadId: {
        type: Number,
        default: 0
    },
    leadStatus: [{
        owner: {
            type: String,
            default: ""
        },
        activity: {
            type: String,
            default: ""
        },
        time: {
            type: String,
            default: ""
        },
    }]

}, {
    versionKey: false,
})
const leadStatusTrack = mongoose.model("leadStatus", leadStatus)
export default leadStatusTrack 