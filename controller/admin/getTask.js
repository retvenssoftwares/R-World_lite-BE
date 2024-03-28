import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import taskModel from "../../models/taskModel.js";

const getTask = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const leadId = +req.query.leadId
        let { startDate, endDate, TMId, taskStatus } = req.query

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

        startDate ? startDate = new Date(startDate) : startDate = new Date();
        endDate ? endDate = new Date(endDate) : endDate = new Date();

        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0).toISOString();
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59).toISOString();

        const pipeline = [];

        if (leadId) {
            if (taskStatus) {
                pipeline.push(
                    {
                        $match: {
                            leadId: leadId,
                            createdAt: { $gte: startDate, $lte: endDate },
                            taskStatus: taskStatus
                        }
                    },
                )
            } else {
                pipeline.push(
                    {
                        $match: {
                            leadId: leadId,
                            createdAt: { $gte: startDate, $lte: endDate }
                        }
                    },
                )
            }
            pipeline.push(
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
                        taskTitle: 1,
                        priority: 1,
                        taskStatus: 1,
                        taskDescription: 1,
                    }
                },
                {
                    $sort: {
                        modifiedOn: -1
                    }
                }
            );
        }

        if (TMId || userId && !leadId) {

            let id
            TMId ? id = TMId : id = userId

            if (taskStatus) {
                pipeline.push(
                    {
                        $match: {
                            assignedTo: id,
                            createdAt: { $gte: startDate, $lte: endDate },
                            taskStatus: taskStatus
                        }
                    }
                )
            } else {
                pipeline.push(
                    {
                        $match: {
                            assignedTo: id,
                            createdAt: { $gte: startDate, $lte: endDate }
                        }
                    },
                )
            }
            pipeline.push(
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
                        taskTittle: 1,
                        priority: 1,
                        taskStatus: 1,
                        taskDescription: 1,
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