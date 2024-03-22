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
    },
    modifiedOn:{
        type:String,
        default:""
    },
    title:{
        type:String,
        default:""
    },
    priority:{
        type:String,
        default:""
    },
    taskStatus:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    }

}, {
    versionKey: false,
})
const taskModel = mongoose.model("task", task)
export default taskModel 