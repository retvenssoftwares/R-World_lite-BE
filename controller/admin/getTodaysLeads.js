import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from '../../models/leadData.js'

const getTodayLeads = async (req, res, next) => {
    try {
        const userId = req.query.userId || req.authData.userId;
        let today = req.query.today;
        let endDate = req.query.endDate;
        let status = req.query.status;

        if (typeof status === 'string') {
            status = [status];
        }

        // const pageSize = parseInt(req.query.pageSize) || 10;
        // const currentPage = parseInt(req.query.page) || 1;
        // const skip = (currentPage - 1) * pageSize;

        const findUser = await userModel.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }

        today ? today = new Date(today) : today = new Date();
        endDate ? endDate = new Date(endDate) : endDate = new Date();
        let todayStart, todayEnd;

        // todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString();
        todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 1, 18, 30, 0)).toISOString();
        // todayEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59).toISOString();
        todayEnd = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)).toISOString();

        // if (type === "7Days") {
        //     todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0);
        //     todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        // }

        // if (type === "15Days") {
        //     todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15, 0, 0, 0);
        //     todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        // }

        // if (type === "30Days") {
        //     todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, 0, 0, 0);
        //     todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        // }

        // if (type === "45Days") {
        //     todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 45, 0, 0, 0);
        //     todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        // }

        // if (type === "90Days") {
        //     todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90, 0, 0, 0);
        //     todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        // }
        let todayLeads = []
        let retryCount = 2

        while (todayLeads.length === 0) {
            let pipeline = [];
            if (req.query.userId) {
                if (status && status.length > 0) {
                    pipeline.push(
                        {
                            $match: {
                                leadOwner: userId,
                                leadStatus: { $in: status }
                            }
                        }
                    )
                } else {
                    pipeline.push(
                        {
                            $match: {
                                leadOwner: userId,
                            }
                        }
                    )
                }
            } else {

                if (status && status.length > 0) {
                    pipeline.push(
                        {
                            $match: {
                                created_time: {
                                    $gte: todayStart,
                                    $lte: todayEnd
                                },
                                leadStatus: { $in: status }
                            }
                        }
                    )
                } else {
                    pipeline.push(
                        {
                            $match: {
                                created_time: {
                                    $gte: todayStart,
                                    $lte: todayEnd
                                },
                            }
                        }
                    )
                }
            }
            pipeline.push(
                {
                    $lookup: {
                        from: 'forms',
                        localField: 'formId',
                        foreignField: 'formId',
                        as: 'formData'
                    }
                },
                {
                    $unwind: {
                        path: '$formData',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "leadOwner",
                        foreignField: "userId",
                        as: "userDetails"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "modifiedBy",
                        foreignField: "userId",
                        as: "userDetail"
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
                    $addFields: {
                        isFavourite: {
                            $cond: {
                                if: { $eq: ["$favLead.userId", userId] },
                                then: true,
                                else: false
                            }
                        },
                        leadOwner: {
                            $cond: {
                                if: { $eq: [{ $size: "$userDetails" }, 0] },
                                then: "",
                                else: { $arrayElemAt: ["$userDetails.firstName", 0] }
                            }
                        },
                        modifiedBy: {
                            $cond: {
                                if: { $eq: [{ $size: "$userDetail" }, 0] },
                                then: "",
                                else: { $arrayElemAt: ["$userDetail.firstName", 0] }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$leadId",
                        formId: { $first: "$formData.formId" },
                        formName: { $first: "$formData.formName" },
                        leadId: { $first: "$leadId" },
                        data: { $first: "$data" },
                        created_time: { $first: "$created_time" },
                        leadOrigin: { $first: "$leadOrigin" },
                        leadSource: { $first: "$leadSource" },
                        leadOwner: { $first: "$leadOwner" },
                        leadStatus: { $first: "$leadStatus" },
                        modifiedOn: { $first: "$modifiedOn" },
                        modifiedBy: { $first: "$modifiedBy" },
                        isFavourite: { $first: "$isFavourite" },
                        closingDate: { $first: "$closingDate" },
                        amountClosed: { $first: "$amountClosed" },
                        campaignName: { $first: "$campaignName" },
                        campaignId: { $first: "$campaignId" },
                        amountNegotiated: { $first: "$amountNegotiated" },
                        amountProposed: { $first: "$amountProposed" },
                        expectedClosingDate: { $first: "$expectedClosingDate" },
                        expectedMeetingDate: { $first: "$expectedMeetingDate" },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        formId: 1,
                        formName: 1,
                        leadId: 1,
                        data: 1,
                        created_time: 1,
                        leadOrigin: 1,
                        leadSource: 1,
                        campaignId: 1,
                        campaignName: 1,
                        leadOwner: 1,
                        leadStatus: 1,
                        modifiedOn: 1,
                        modifiedBy: 1,
                        isFavourite: 1,
                        closingDate: 1,
                        amountClosed: 1,
                        amountProposed: 1,
                        amountNegotiated: 1,
                        expectedMeetingDate: 1,
                        expectedClosingDate: 1
                    }
                },
                {
                    $sort: {
                        created_time: -1
                    }
                }
            );

            todayLeads = await leadModel.aggregate(pipeline);
            todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - retryCount, 18, 30, 0)).toISOString();
            retryCount++;
        }
        // const paginatedResults = todayLeads.slice(skip, skip + pageSize);

        // if (paginatedResults.length > 0) {
        //     return res.status(200).json({
        //         status: true,
        //         code: 200,
        //         message: "Today's leads retrieved successfully",
        //         currentPage,
        //         pageSize,
        //         data: paginatedResults,
        //     });
        // } else {
        //     return res.status(200).json({
        //         status: true,
        //         code: 200,
        //         message: 'You have reached the end',
        //         currentPage,
        //         pageSize,
        //     });
        // }

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Today's leads retrieved successfully",
            data: todayLeads
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getTodayLeads;