import mongoose from "mongoose"

const task = new mongoose.Schema({
    taskId: {
        type: Number,
        default: ""
    },
    leadId: {
        type: Number,
        default: ""
    },
    assignedTo: {
        type: String,
        default: ""
    },
    assignedBy: {
        type: String,
        default: ""
    }

}, {
    versionKey: false,
})
const taskModel = mongoose.model("task", task)
export default taskModel 