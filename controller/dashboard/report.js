import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from "../../models/leadData.js";
import leadStatusTrack from "../../models/leadStatusTrack.js";

const getMonthReport = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const { startDate, endDate } = req.query

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
        let pipeline1 = [];
        
        const currentDate = new Date();

        let firstDateOfMonth, lastDateOfMonth

        startDate ? firstDateOfMonth = new Date(startDate).toISOString() : firstDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString()

        endDate ? lastDateOfMonth = new Date(endDate).toISOString() : lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

        pipeline.push(
            {
                $match: {
                    created_time: { $gte: firstDateOfMonth, $lte: lastDateOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalLeads: { $sum: 1 },
                    amountClosed: { $sum: "$amountClosed" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalLeads: 1,
                    amountClosed: 1
                }
            }
        );

        pipeline1.push(
            {
                $match: {
                    created_time: { $gte: firstDateOfMonth, $lte: lastDateOfMonth }
                }
            },
            {
                $unwind: {
                    path: "$leadStatus",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "leadStatus.modifiedOn": { $gte: firstDateOfMonth, $lte: lastDateOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    qualifiedLeads: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$leadStatus.status", "Qualification"] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    meetings: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$leadStatus.status", "Meeting"] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    meetingDone: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$leadStatus.status", "MeetingDone"] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    conversions: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$leadStatus.status", "Customer"] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    qualifiedLeads: 1,
                    meetings: 1,
                    MeetingDone: 1,
                    conversions: 1
                }
            }
        );

        let totalLeads = await leadModel.aggregate(pipeline);
        let qualifiedLeads = await leadStatusTrack.aggregate(pipeline1);

        const amountClosed = totalLeads[0].amountClosed
        totalLeads = totalLeads[0]?.totalLeads;
        const meetings = qualifiedLeads[0]?.meetings;
        const meetingDone = qualifiedLeads[0]?.meetingDone;
        const conversions = qualifiedLeads[0]?.conversions;
        qualifiedLeads = qualifiedLeads[0]?.qualifiedLeads;

        let qualifiedToMeetingRatio
        let leadsToMeetingRatio
        let meetingGenerateToDoneRatio
        let meetingDoneToConversionRatio
        let leadsToConversionRatio

        if (meetings > 0) {
            qualifiedToMeetingRatio = (qualifiedLeads / meetings) * 100
            leadsToMeetingRatio = (totalLeads / meetings) * 100
        } else {
            qualifiedToMeetingRatio = 0
            leadsToMeetingRatio = 0
        }

        if (meetingDone > 0) {
            meetingGenerateToDoneRatio = (meetings / meetingDone) * 100
            meetingDoneToConversionRatio = (meetingDone / conversions) * 100
        } else {
            meetingGenerateToDoneRatio = 0
            meetingDoneToConversionRatio = 0
        }

        conversions > 0 ? leadsToConversionRatio = (totalLeads / conversions) * 100 : leadsToConversionRatio = 0

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Report created successfully",
            data: { totalLeads, qualifiedLeads, meetings, meetingDone, conversions, qualifiedToMeetingRatio, leadsToMeetingRatio, meetingGenerateToDoneRatio, meetingDoneToConversionRatio, leadsToConversionRatio, amountClosed }
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getMonthReport;