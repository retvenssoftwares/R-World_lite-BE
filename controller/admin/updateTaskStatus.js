import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import taskModel from "../../models/taskModel.js";
import leadStatusTrack from "../../models/leadStatusTracker.js";

const updateTaskStatus = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const taskId = +req.query.taskId
        const taskStatus = req.body.taskStatus
        const activity = req.body.activity

        if (!userId && !taskId) {
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

        const date = new Date().toISOString();
        const findTask = await taskModel.findOne({ taskId: taskId });
        const leadId = findTask.leadId;
        await taskModel.updateMany({ taskId: taskId }, { $set: { taskStatus: taskStatus, modifiedOn: date, modifiedBy: userId } })

        if (activity) {
            const findLeadStatus = await leadStatusTrack.findOne({ leadId: leadId });
            if (!findLeadStatus) {
                const newLeadStatus = new leadStatusTrack({
                    leadId: leadId,
                    leadStatus: [{
                        owner: userId,
                        activity: activity,
                        time: date,
                    }]
                })
                await newLeadStatus.save();
            } else {
                const leadStatusObject = {
                    owner: userId,
                    activity: activity,
                    time: date,
                }
                findLeadStatus.leadStatus.unshift(leadStatusObject);
                await findLeadStatus.save();
            }
        }

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Task updated successfully",
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default updateTaskStatus;