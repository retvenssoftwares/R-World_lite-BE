import mongoose from "mongoose"

const activityModel = new mongoose.Schema({
    leadId: {
        type: Number,
        default: 0
    },
    activityStatus: [{
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
const activityHistory = mongoose.model("activityHistory", activityModel)
export default activityHistory