import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import taskModel from "../../models/taskModel.js";

const getTask = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const leadId = +req.query.leadId
        const TMId = req.query.TMId

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

        const pipeline = [];

        if (leadId) {
            pipeline.push(
                {
                    $match: {
                        leadId: leadId,
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "assignedTo",
                        foreignField: "userId",
                        as: "userDetails"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "assignedBy",
                        foreignField: "userId",
                        as: "userDetail"
                    }
                },
                {
                    $addFields: {
                        assignedTo: {
                            $cond: {
                                if: { $eq: [{ $size: "$userDetails" }, 0] },
                                then: "",
                                else: { $arrayElemAt: ["$userDetails.firstName", 0] }
                            }
                        },
                        assignedBy: {
                            $cond: {
                                if: { $eq: [{ $size: "$userDetail" }, 0] },
                                then: "",
                                else: { $arrayElemAt: ["$userDetail.firstName", 0] }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        leadId: 1,
                        taskId: 1,
                        assignedTo: 1,
                        assignedBy: 1,
                        modifiedOn: 1,
                        title: 1,
                        priority: 1,
                        taskStatus: 1,
                        description: 1,
                    }
                }
            );
        }

        if (TMId || userId && !leadId) {
            let id
            console.log('id: ', id);

            if (TMId) {
                id = TMId
            } else {
                id = userId
            }

            pipeline.push(
                {
                    $match: {
                        assignedTo: id,
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "assignedTo",
                        foreignField: "userId",
                        as: "userDetails"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "assignedBy",
                        foreignField: "userId",
                        as: "userDetail"
                    }
                },
                {
                    $addFields: {
                        assignedTo: {
                            $cond: {
                                if: { $eq: [{ $size: "$userDetails" }, 0] },
                                then: "",
                                else: { $arrayElemAt: ["$userDetails.firstName", 0] }
                            }
                        },
                        assignedBy: {
                            $cond: {
                                if: { $eq: [{ $size: "$userDetail" }, 0] },
                                then: "",
                                else: { $arrayElemAt: ["$userDetail.firstName", 0] }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        leadId: 1,
                        taskId: 1,
                        assignedTo: 1,
                        assignedBy: 1,
                        modifiedOn: 1,
                        title: 1,
                        priority: 1,
                        taskStatus: 1,
                        description: 1,
                    }
                },
                {
                    $sort: {
                        modifiedOn: -1
                    }
                }
            );
        }

        const findTask = await taskModel.aggregate(pipeline);

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Task history fetched successfully",
            data: findTask
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getTask;