import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from '../../models/leadData.js'

const getLeadDetails = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        let leadId = +req.query.leadId;

        const findUser = await userModel.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }

        if (!leadId) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: "provide lead Id",
            });
        }

        const pipeline = [];
        pipeline.push(
            {
                $match: {
                    leadId: leadId,
                }
            },
            {
                $lookup: {
                    from: "favourites",
                    localField: "leadId",
                    foreignField: "leadId",
                    as: "favLead"
                }
            },
            {
                $addFields: {
                    isFavourite: {
                        $cond: {
                            if: { $ne: [{ $size: "$favLead" }, 0] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
        );

        const leadsDetails = await leadModel.aggregate(pipeline);

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Details Fetched successfully",
            data: leadsDetails,
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getLeadDetails;