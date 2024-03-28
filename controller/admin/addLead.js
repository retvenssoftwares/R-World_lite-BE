import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import formModel from "../../models/forms.js";
import leadModel from "../../models/leadData.js";

const addLeads = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const formData = req.body.formData;

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

        const findForm = await formModel.findOne({ formId: formData?.formId });
        if (!findForm) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Form not found add new one",
            });
        }
        const date = new Date().toISOString();

        const leadData = formData?.data?.map(item => ({
            fieldName: findForm?.fields?.find(field => field?.fieldId === item?.fieldId)?.fieldName || "",
            fieldId: item.fieldId,
            fieldValue: item.fieldValue
        }));

        const newLead = new leadModel({
            formId: +formData?.formId,
            leadId: +formData?.leadId,
            created_time: date,
            data: leadData,
            leadOrigin: formData?.leadOrigin,
            leadSource: formData?.leadSource,
            campaignId: formData?.campaignId,
            campaignName: formData?.campaignName,
            leadStatus: formData?.leadStatus,
            leadOwner: formData?.leadOwner || userId,
            modifiedOn: formData?.modifiedOn,
            modifiedBy: formData?.modifiedBy,
            closingDate: formData?.closingDate,
            followUpDate: formData?.followUpDate,
            amountClosed: formData?.amountClosed,
            amountProposed: formData?.amountProposed,
            amountNegotiated: formData?.amountNegotiated,
            expectedMeetingDate: formData?.expectedMeetingDate,
            expectedClosingDate: formData?.expectedClosingDate,
        })
        await newLead.save()

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Lead added successfully",
            data: newLead
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default addLeads;