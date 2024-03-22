import mongoose from "mongoose";

const notes = new mongoose.Schema({
    leadId: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: ""
    },
    time: {
        type: String,
        default: ""
    }
}, {
    versionKey: false
})

const notesModel = mongoose.model("notes", notes);
export default notesModel;