import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from '../../models/leadData.js'

const getTodayLeads = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        let today = req.query.today;

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.page) || 1;
        const skip = (currentPage - 1) * pageSize;

        const findUser = await userModel.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }

        today ? today = new Date(today) : today = new Date();
        let todayStart, todayEnd;

        todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);


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

        const pipeline = [];

        pipeline.push(
            {
                $match: {
                    created_time: {
                        $gte: todayStart.toISOString(),
                        $lte: todayEnd.toISOString()
                    }
                }
            },
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
                    leadStatus: { $first: "$leadStatus" },
                    isFavourite: { $first: "$isFavourite" }
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
                    leadStatus: 1,
                    isFavourite: 1
                }
            },
            {
                $sort: {
                    created_time: -1
                }
            }
        );

        const todayLeads = await leadModel.aggregate(pipeline);

        const paginatedResults = todayLeads.slice(skip, skip + pageSize);

        if (paginatedResults.length > 0) {
            return res.status(200).json({
                status: true,
                code: 200,
                message: "Today's leads retrieved successfully",
                currentPage,
                pageSize,
                data: paginatedResults,
            });
        } else {
            return res.status(200).json({
                status: true,
                code: 200,
                message: 'You have reached the end',
                currentPage,
                pageSize,
            });
        }

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getTodayLeads;