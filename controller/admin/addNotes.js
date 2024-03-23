import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import notesModel from "../../models/notes.js";
import Randomstring from "randomstring";

const addNotes = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const leadId = +req.query.leadId
        const notes = req.body.notes
        const tittle = req.body.tittle

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
        const findNote = await notesModel.findOne({ leadId: leadId });

        if (findNote) {
            const notesObject = {
                noteId: Randomstring.generate({ charset: 'numeric', length: 6 }),
                tittle: tittle,
                notes: notes,
                addedBy: userId,
                time: new Date().toISOString()
            }
            findNote.notes.unshift(notesObject);
            await findNote.save()
            return res.status(200).json({
                status: true,
                code: 200,
                message: "Notes added successfully",
            });
        } else {
            const newNote = new notesModel({
                leadId: leadId,
                notes: [{
                    noteId: Randomstring.generate({ charset: 'numeric', length: 6 }),
                    tittle: tittle,
                    notes: notes,
                    addedBy: userId,
                    time: new Date().toISOString()
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