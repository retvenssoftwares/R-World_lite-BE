import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from '../../models/leadData.js'
import taskModel from "../../models/taskModel.js";
import Randomstring from "randomstring";
import activityHistory from "../../models/activityHistory.js";
import leadStatusTrack from "../../models/leadStatusTrack.js";
import notesModel from "../../models/notes.js";

const updateLeadStatus = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const leadId = +req.query.leadId
        const { owner, leadStatus, taskStatus, taskTitle, priority, taskDescription, activity, amountClosed, closingDate, followUpDate, deadline, amountProposed, amountNegotiated, expectedMeetingDate, notesTitle, notesDescription, expectedClosingDate } = req.body

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

        const findLead = await leadModel.findOne({ leadId: leadId })

        if (owner) {
            await leadModel.updateMany({ leadId: leadId }, { $set: { owner: owner, modifiedOn: date, modifiedBy: userId } })
        }

        if (amountClosed) {
            await leadModel.updateMany({ leadId: leadId }, { $set: { amountClosed: +amountClosed, modifiedOn: date, modifiedBy: userId } })
        }

        if (followUpDate) {
            const date = new Date(followUpDate).toISOString();
            await leadModel.updateMany({ leadId: leadId }, { $set: { followUpDate: date, modifiedOn: date, modifiedBy: userId } })
        }

        if (closingDate) {
            const date = new Date(closingDate).toISOString();
            await leadModel.updateMany({ leadId: leadId }, { $set: { closingDate: date, modifiedOn: date, modifiedBy: userId } })
        }

        if (leadStatus) {
            await leadModel.updateOne({ leadId: leadId }, { $set: { leadStatus: leadStatus, modifiedOn: date, modifiedBy: userId } });

            if (amountProposed) {
                await leadModel.updateOne({ leadId: leadId }, { $set: { amountProposed: +amountProposed, modifiedOn: date, modifiedBy: userId } });
            }

            if (amountNegotiated) {
                await leadModel.updateOne({ leadId: leadId }, { $set: { amountNegotiated: +amountNegotiated, modifiedOn: date, modifiedBy: userId } });
            }

            if (expectedMeetingDate) {
                const date = new Date(expectedMeetingDate).toISOString();
                await leadModel.updateOne({ leadId: leadId }, { $set: { expectedMeetingDate: expectedMeetingDate, modifiedOn: date, modifiedBy: userId } });
            }

            if (expectedClosingDate) {
                const date = new Date(expectedClosingDate).toISOString();
                await leadModel.updateOne({ leadId: leadId }, { $set: { expectedClosingDate: expectedClosingDate, modifiedOn: date, modifiedBy: userId } });
            }

            const findLeadTrack = await leadStatusTrack.findOne({ leadId: leadId });

            if (!findLeadTrack) {
                const newLeadTrack = new leadStatusTrack({
                    leadId: leadId,
                    created_time: findLead?.created_time,
                    leadStatus: [{
                        modifiedBy: userId,
                        status: leadStatus,
                        modifiedOn: date,
                    }]
                })
                await newLeadTrack.save();
            } else {
                const leadTrackObject = {
                    modifiedBy: userId,
                    status: leadStatus,
                    modifiedOn: date,
                }
                findLeadTrack.leadStatus.unshift(leadTrackObject);
                await findLeadTrack.save();
            }
        }

        if (activity) {
            const findActivityStatus = await activityHistory.findOne({ leadId: leadId });
            if (findActivityStatus) {
                const activityStatusObject = {
                    owner: userId,
                    activity: activity,
                    time: date,
                }
                findActivityStatus.activityStatus.unshift(activityStatusObject);
                await findActivityStatus.save();
            } else {
                const newActivityStatus = new activityHistory({
                    leadId: leadId,
                    activityStatus: [{
                        owner: userId,
                        activity: activity,
                        time: date,
                    }]
                })
                await newActivityStatus.save();
            }
        }

        if (owner || leadStatus) {
            const newTask = new taskModel({
                taskId: Randomstring.generate({ charset: 'numeric', length: 8 }),
                leadId: leadId,
                assignedTo: owner || userId,
                assignedBy: userId,
                title: taskTitle,
                modifiedOn: date,
                createdAt: date,
                deadline: deadline,
                taskStatus: taskStatus,
                priority: priority,
                description: taskDescription,
            })
            await newTask.save();
        }

        if (notesTitle || notesDescription) {
            const findNote = await notesModel.findOne({ leadId: leadId });

            if (findNote) {
                const notesObject = {
                    noteId: Randomstring.generate({ charset: 'numeric', length: 6 }),
                    tittle: notesTitle,
                    notes: notesDescription,
                    addedBy: userId,
                    time: date
                }
                findNote.notes.unshift(notesObject);
                await findNote.save()
            } else {
                const newNote = new notesModel({
                    leadId: leadId,
                    notes: [{
                        noteId: Randomstring.generate({ charset: 'numeric', length: 6 }),
                        tittle: notesTitle,
                        notes: notesDescription,
                        addedBy: userId,
                        time: date
                    }]
                })
                await newNote.save()
            }

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

export default updateLeadStatus;