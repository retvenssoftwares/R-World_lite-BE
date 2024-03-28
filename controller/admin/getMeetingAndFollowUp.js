import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from "../../models/leadData.js";

const getMeetAndFollowUp = async (req, res, next) => {
    try {
        const userId = req.query.userId || req.authData.userId;
        console.log('userId: ', userId);
        let date = req.query.date
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

        let pipeline = [];
        date ? date = new Date(date) : date = new Date();
        let todayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)).toISOString();
        console.log('todayStart: ', todayStart);
        let todayEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)).toISOString();
        console.log('todayEnd: ', todayEnd);

        if (type === "meetings") {
            console.log("vbnjkuygtfv");
            pipeline.push(
                {
                    $match: {
                        leadOwner: userId,
                        expectedMeetingDate: { $gte: todayStart, $lte: todayEnd },
                    }
                }
            )
        } else {
            console.log("hokjfcjf");
            pipeline.push(
                {
                    $match: {
                        leadOwner: userId,
                        followUpDate: { $gte: todayStart, $lte: todayEnd },
                    }
                }
            )
        }

        const response = await leadModel.aggregate(pipeline)
        return res.status(200).json({
            status: true,
            code: 200,
            message: "data fetched successfully",
            data: response
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getMeetAndFollowUp;