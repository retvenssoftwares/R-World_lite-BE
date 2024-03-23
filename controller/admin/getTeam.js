import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import notesModel from "../../models/notes.js";

const getTeam = async (req, res, next) => {
    try {
        const userId = req.authData.userId;

        if (!userId) {
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

        const findTeam = await userModel.aggregate([
            {
                $match: {
                    leaderId: userId
                }
            },
            {
                $project:{
                    _id:0,
                    userId:1,
                    firstName:1,
                    designation:1,
                }
            }
        ])

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Team fetched successfully",
            data: findTeam
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getTeam;