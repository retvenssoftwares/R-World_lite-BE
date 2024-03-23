import mongoose from "mongoose";

const notes = new mongoose.Schema({
    leadId: {
        type: Number,
        default: 0
    },
    notes: [{
        noteId: {
            type: Number,
            default: 0
        },
        tittle: {
            type: String,
            default: ""
        },
        notes: {
            type: String,
            default: ""
        },
        addedBy: {
            type: String,
            default: ""
        },
        time: {
            type: String,
            default: ""
        }
    }],
}, {
    versionKey: false
})

const notesModel = mongoose.model("notes", notes);
export default notesModel;