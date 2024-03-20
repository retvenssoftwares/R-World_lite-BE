import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from '../../models/leadData.js'

const getTodayLeads = async (req, res, next) => {
    try {
        const email = req.query.email;
        const type = req.query.type;
        const findUser = await userModel.findOne({ email: email });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }

        const today = new Date();
        let todayStart, todayEnd;

        if (type === "today") {
            todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }

        if (type === "7Days") {
            todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0);
            todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }

        if (type === "15Days") {
            todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15, 0, 0, 0);
            todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }

        if (type === "30Days") {
            todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30, 0, 0, 0);
            todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }

        if (type === "45Days") {
            todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 45, 0, 0, 0);
            todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }

        if (type === "90Days") {
            todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90, 0, 0, 0);
            todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        }

        const pipeline = [];

        if (todayStart && todayEnd) {
            pipeline.push({
                $match: {
                    created_time: {
                        $gte: todayStart.toISOString(),
                        $lte: todayEnd.toISOString()
                    }
                }
            });
        }

        pipeline.push({
            $sort: {
                created_time: -1
            }
        });

        const todayLeads = await leadModel.aggregate(pipeline);


        return res.status(200).json({
            status: true,
            code: 200,
            message: "Today's leads retrieved successfully",
            data: todayLeads,
        });
    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getTodayLeads;