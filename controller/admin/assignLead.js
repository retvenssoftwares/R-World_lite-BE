import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from "../../models/leadData.js";
import taskModel from "../../models/taskModel.js";
import Randomstring from "randomstring";
import activityHistory from "../../models/activityHistory.js";

const assignLead = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const userName = req.authData.firstName;
        const ownerId = req.body.ownerId;
        const data = req.body.data

        if (!userId && !ownerId) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: "Please provide all the required field",
            });
        }

        const findUser = await userModel.findOne({ userId: ownerId });
        console.log('findUser: ', findUser.firstName);

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Owner does not exist",
            });
        }

        const date = new Date().toISOString();
        Promise.all(
            data.map(async (item) => {
                await leadModel.updateMany({ leadId: item?.leadId }, { $set: { leadOwner: ownerId, modifiedOn: date, modifiedBy: userId } });

                const newTask = new taskModel({
                    taskId: Randomstring.generate({ charset: 'numeric', length: 8 }),
                    leadId: item?.leadId,
                    assignedTo: ownerId,
                    assignedBy: userId,
                    createdAt: date,
                })
                await newTask.save();

                const findActivityStatus = await activityHistory.findOne({ leadId: item?.leadId });
                if (!findActivityStatus) {
                    const newActivityStatus = new activityHistory({
                        leadId: item?.leadId,
                        activityStatus: [{
                            owner: ownerId,
                            activity: `This lead is assigned by ${userName} to ${findUser?.firstName}`,
                            time: date,
                        }]
                    })
                    await newActivityStatus.save();
                } else {
                    const activityStatusObject = {
                        owner: ownerId,
                        activity: `This lead is assigned by ${userName} to ${findUser?.firstName}`,
                        time: date,
                    }
                    findActivityStatus.activityStatus.unshift(activityStatusObject);
                    await findActivityStatus.save();
                }
            })
        )

        return res.status(200).json({
            status: true,
            code: 200,
            message: "assigned successfully",
        });


    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default assignLead;