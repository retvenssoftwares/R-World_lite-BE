import mongoose from "mongoose"

const lead = new mongoose.Schema({
    formId: {
        type: Number,
        default: 0
    },
    leadId: {
        type: Number,
        default: 0
    },
    created_time: {
        type: String,
        default: ""
    },
    data: [{
        fieldName: {
            type: String,
            default: ""
        },
        fieldId: {
            type: String,
            default: ""
        },
        fieldValue: {
            type: String,
            default: ""
        }
    }],
    leadOrigin: {
        type: String,
        default: ""
    },
    leadSource: {
        type: String,
        default: ""
    },
    campaignId: {
        type: Number,
        default: ""
    },
    campaignName: {
        type: String,
        default: ""
    },
    leadStatus: {
        type: String,
        default: ""
    },
    leadOwner: {
        type: String,
        default: ""
    },
    modifiedOn: {
        type: String,
        default: ""
    },
    modifiedBy: {
        type: String,
        default: ""
    },
    closingDate: {
        type: String,
        default: ""
    },
    followUpDate: {
        type: String,
        default: ""
    },
    amountClosed: {
        type: Number,
        default: 0
    },
    amountProposed: {
        type: Number,
        default: 0
    },
    amountNegotiated: {
        type: Number,
        default: 0
    },
    expectedMeetingDate: {
        type: String,
        default: ""
    },
    expectedClosingDate: {
        type: String,
        default: ""
    },
}, {
    versionKey: false,
})
const leadModel = mongoose.model("lead", lead)
export default leadModel 