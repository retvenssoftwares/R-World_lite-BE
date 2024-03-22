import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import notesModel from "../../models/notes.js";

const addNotes = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const leadId = +req.query.leadId
        const notes = +req.body.notes

        if (!userId && !leadId) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: "Please provide all the required field",
            });
        }
        const findUser = await userModel.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }
        const findnote = await notesModel.findOne({ noteId: noteId });

        if (findnote) {
            notesObject = {
                notes: notes,
                addedBy: userId,
                time: new Date()
            }
            findnote.notes.unshift(notesObject);
            await findnote.save()
            return res.status(200).json({
                status: true,
                code: 200,
                message: "Notes added successfully",
            });
        } else {
            const newNote = new notesModel({
                leadId: leadId,
                notes: [{
                    notes: notes,
                    addedBy: userId,
                    time: new Date()
                }]
            })
            await newNote.save()
            return res.status(200).json({
                status: true,
                code: 200,
                message: "Notes added successfully",
            });
        }

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default addNotes;