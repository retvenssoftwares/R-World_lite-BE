import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import activityHistory from "../../models/activityHistory.js";

const getActivity = async (req, res, next) => {
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

        const findLead = await activityHistory.aggregate([
            {
                $match: {
                    leadId: leadId
                }
            },
            {
                $unwind: {
                    path: "$leadStatus",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "leadStatus.owner",
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
                    activity: "$leadStatus.activity",
                    time: "$leadStatus.time",
                    ownerName: "$userDetails.firstName",
                }
            }
        ]);

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Activity history fetched successfully",
            data: findLead || ""
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getActivity;