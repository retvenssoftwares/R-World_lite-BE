import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from '../../models/leadData.js'

const leadStatus = async (req, res, next) => {
    try {
        const email = req.query.email;
        const leadId = +req.query.leadId
        const leadStatus = req.body.leadStatus

        if (!email && !leadId) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: "Please provide all the required field",
            });
        }
        const findUser = await userModel.findOne({ email: email });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }

        const updateStatus = await leadModel.updateOne({ leadId: leadId }, { $set: { leadStatus: leadStatus } });

        if (updateStatus.modifiedCount === 0) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "status not updated",
            });
        }

        const updatedLead = await leadModel.findOne({ leadId: leadId });

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Lead Status Updated Successfully",
            data: updatedLead,
        });
    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default leadStatus;