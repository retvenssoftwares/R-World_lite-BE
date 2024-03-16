import mongoose from "mongoose"

const task = new mongoose.Schema({
    taskId: {
        type: String,
        default: ""
    },

},{
    versionKey: false,
})
const taskModel = mongoose.model("task", task)
export default taskModel 