import mongoose from "mongoose"

const leadStatus = new mongoose.Schema({
    leadId: {
        type: Number,
        default: 0
    },
    created_time: {
        type: String,
        default: ""
    },
    leadStatus: [{
        modifiedBy: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            default: ""
        },
        modifiedOn: {
            type: String,
            default: ""
        },
    }]

}, {
    versionKey: false,
})
const leadStatusTrack = mongoose.model("leadStatus", leadStatus);
export default leadStatusTrack;