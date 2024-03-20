import mongoose from "mongoose"

const lead = new mongoose.Schema({
    formId: {
        type: Number,
        default: 0
    },
    formName: {
        type: String,
        default: ""
    },
    leadId: {
        type: Number,
        default: 0
    },
    created_time: {
        type: String,
        default: ""
    },
    fullName: {
        type: String,
        default: ""
    },
    leadCount: {
        type: Number,
        default: 0
    },
    city: {
        type: String,
        default: ""
    },
    rooms: {
        type: String,
        default: 0
    },
    phoneNumber: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        default: ""
    },
    hotelName: {
        type: String,
        default: ""
    },
    channel_manager: {
        type: String,
        default: ""
    },
    companyName: {
        type: String,
        default: ""
    },
    leadOrigin: {
        type: String,
        default: ""
    },
    leadSource: {
        type: String,
        default: ""
    },
    leadStatus: {
        type: String,
        default: ""
    }

}, {
    versionKey: false,
})
const leadModel = mongoose.model("lead", lead)
export default leadModel 