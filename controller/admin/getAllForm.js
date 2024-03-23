import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import formModel from "../../models/forms.js";

const getForm = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const formId = +req.query.formId;

        if (!userId && !formId) {
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

        if (formId) {
            pipeline.push(
                {
                    $match: {
                        formId: formId
                    }
                }
            )
        } else {

            pipeline.push(
                {
                    $project: {
                        _id: 0,
                        formId: 1,
                        formName: 1,
                        status: 1,
                    }
                },
                {
                    $sort: {
                        formName: 1
                    }
                }
            )
        }

        const findFrom = await formModel.aggregate(pipeline)

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Forms fetched successfully",
            data: findFrom
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getForm;