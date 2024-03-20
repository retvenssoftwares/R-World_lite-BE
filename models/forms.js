import mongoose from "mongoose"

const form = new mongoose.Schema({
    formId: {
        type: Number,
        default: ""
    },
    formName: {
        type: String,
        default: ""
    },
    leads_count: {
        type: Number,
        default: ""
    },
    created_time: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    },
    extractionDate: {
        type: String,
        default: ""
    },
    fields: [{
        fieldName: {
            type: String,
            default: ""
        },
        fieldId: {
            type: String,
            default: ""
        }
    }]

}, {
    versionKey: false,
})
const formModel = mongoose.model("form", form)
export default formModel 