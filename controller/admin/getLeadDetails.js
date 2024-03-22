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
                $unwind: {
                    path: "$favLead",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "forms",
                    localField: "formId",
                    foreignField: "formId",
                    as: "formDetails"
                }
            },
            {
                $unwind: {
                    path: "$formDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "modifiedBy",
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
                $addFields: {
                    isFavourite: {
                        $cond: {
                            if: { $eq: ["$favLead.userId", userId] },
                            then: true,
                            else: false
                        }
                    },
                    formName: "$formDetails.formName",
                    modifiedBy: {
                        $cond: {
                            if: { $eq: [{ $type: "$userDetails" }, "missing"] },
                            then: "",
                            else: { $arrayElemAt: ["$userDetails.firstName", 0] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    leadId: 1,
                    formId: 1,
                    formName: 1,
                    created_time: 1,
                    data: 1,
                    leadOrigin: 1,
                    leadOwner: 1,
                    leadSource: 1,
                    leadStatus: 1,
                    isFavourite: 1,
                    modifiedBy: 1,
                    modifiedOn: 1,
                    isFavourite: 1,
                    closingDate: 1,
                    amountClosed: 1
                }
            }
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