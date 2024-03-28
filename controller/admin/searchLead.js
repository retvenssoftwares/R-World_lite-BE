import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from "../../models/leadData.js";

const searchResult = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const { email, mobileNo, hotelName, fullName } = req.query

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

        const foundResult = await leadModel.filter({})

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Data fetched successfully",
            data: foundResult
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default searchResult;