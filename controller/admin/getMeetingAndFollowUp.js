import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';

const getMeetAndFollowUp = async (req, res, next) => {
    try {
        const userId = req.query.userId || req.authData.userId;
        const type = req.query.type

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
        if(type==="meetings")

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

export default getMeetAndFollowUp;