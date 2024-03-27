import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from '../../models/leadData.js'

const leadsOverview = async (req, res, next) => {
    try {

        const userId = req.authData.userId;
        const type = req.query.type;

        const findUser = await userModel.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }

        const today = new Date();
        let todayStart, todayEnd;

        todayStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0)).toISOString();
        console.log('todayStart: ', todayStart);
        todayEnd = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)).toISOString();
        console.log('todayEnd: ', todayEnd);

        let pipeline = [];
        let response

        if (type) {
            if (type !== "activeLeads") {
                pipeline.push(
                    {
                        $match: {
                            created_time: {
                                $gte: todayStart,
                                $lte: todayEnd,
                            },
                            leadStatus: type,
                        }
                    },
                )
            } else {
                pipeline.push(
                    {
                        $match: {
                            created_time: {
                                $gte: todayStart,
                                $lte: todayEnd,
                            },
                            leadStatus: {
                                $nin: ["New Lead", "Customer", "Not-interested", "Not Qualified", "Invalid", "Wrong Lead"]
                            }
                        }
                    },
                )
            }
            const overview = await leadModel.aggregate(pipeline);
            response = overview

        } else {
            pipeline.push(
                {
                    $match: {
                        created_time: {
                            $gte: todayStart,
                            $lte: todayEnd
                        }
                    }
                },
                {
                    $group: {
                        _id: 0,
                        newLeads: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$leadStatus", "New Lead"] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        activeLeads: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $in: [
                                            "$leadStatus",
                                            ["New Lead", "Customer", "Not-interested", "Not Qualified", "Invalid", "Wrong Lead"]
                                        ]
                                    },
                                    then: 0,
                                    else: 1
                                }
                            }
                        },
                        qualifiedLeads: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$leadStatus", "Qualification"] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        followUpLeads: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$leadStatus", "Follow Up"] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        newLeads: 1,
                        activeLeads: 1,
                        qualifiedLeads: 1,
                        followUpLeads: 1,
                    }
                }
            );

            const overview = await leadModel.aggregate(pipeline);
            response = overview[0]
        }

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Leads Overview",
            data: response,
        });
    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default leadsOverview;