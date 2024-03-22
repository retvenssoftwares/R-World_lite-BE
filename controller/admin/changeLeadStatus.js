import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from '../../models/leadData.js'
import taskModel from "../../models/taskModel.js";
import Randomstring from "randomstring";
import leadStatusTrack from "../../models/leadStatusTracker.js";

const leadStatus = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        console.log('userId: ', userId);
        const leadId = +req.query.leadId
        console.log('leadId: ', leadId);
        const { owner, leadStatus, taskStatus, title, priority, description, activity } = req.body

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
        const date = new Date().toISOString();

        if (owner) {
            await leadModel.updateMany({ leadId: leadId }, { $set: { owner: owner, modifiedOn: date, modifiedBy: userId } })
        }

        if (leadStatus) {
            await leadModel.updateOne({ leadId: leadId }, { $set: { leadStatus: leadStatus, modifiedOn: date, modifiedBy: userId } });

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

        if (owner || leadStatus) {
            const newTask = new taskModel({
                taskId: Randomstring.generate({ charset: 'numeric', length: 8 }),
                leadId: leadId,
                assignedTo: owner || userId,
                assignedBy: userId,
                title: title,
                description: description,
                modifiedOn: date,
                taskStatus: taskStatus,
                priority: priority,
            })
            await newTask.save();
        }

        const updatedLead = await leadModel.findOne({ leadId: leadId });

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Updated Successfully",
            data: updatedLead,
        });
    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default leadStatus;