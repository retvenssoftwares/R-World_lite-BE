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
    createdAt:{
        type:String,
        default:""
    },
    modifiedOn:{
        type:String,
        default:""
    },
    taskTitle:{
        type:String,
        default:"new Task"
    },
    deadline:{
        type:String,
        default:""
    },
    priority:{
        type:String,
        default:"High"
    },
    taskStatus:{
        type:String,
        default:"pending"
    },
    taskDescription:{
        type:String,
        default:""
    }

}, {
    versionKey: false,
})
const taskModel = mongoose.model("task", task)
export default taskModel 