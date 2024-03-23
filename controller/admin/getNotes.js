import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import notesModel from "../../models/notes.js";

const getNotes = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const leadId = +req.query.leadId

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

        const findNote = await notesModel.aggregate([
            {
                $match: {
                    leadId: leadId
                }
            },
            {
                $unwind: {
                    path: "$notes",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "notes.addedBy",
                    foreignField: "userId",
                    as: "userDetails"
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    leadId: 1,
                    noteId: 1,
                    tittle: "$notes.tittle",
                    notes: "$notes.notes",
                    time: "$notes.time",
                    addedBy: "$userDetails.firstName",
                }
            }
        ])

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Notes history fetched successfully",
            data: findNote
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getNotes;