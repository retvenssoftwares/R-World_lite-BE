import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import leadModel from "../../models/leadData.js";

const searchResult = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const { email, mobileNo, hotelName, fullName } = req.query

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

        if (hotelName) {
            const regex = new RegExp(hotelName, 'i');

            pipeline.push(
                {
                    $match: {
                        "data": {
                            $elemMatch: {
                                "fieldName": { $in: ["your_hotel's_name", "your_hotel_name"] },
                                "fieldValue": { $regex: regex }
                            }
                        }
                    }
                }
            )
        }

        if (email) {
            const regex = new RegExp(email, 'i');

            pipeline.push(
                {
                    $match: {
                        "data": {
                            $elemMatch: {
                                "fieldName": "email",
                                "fieldValue": { $regex: regex }
                            }
                        }
                    }
                }
            )
        }

        if (mobileNo) {
            const regex = new RegExp(mobileNo, 'i');

            pipeline.push(
                {
                    $match: {
                        "data": {
                            $elemMatch: {
                                "fieldName": "phone_number",
                                "fieldValue": { $regex: regex }
                            }
                        }
                    }
                }
            )
        }

        if (fullName) {
            const regex = new RegExp(fullName, 'i');

            pipeline.push(
                {
                    $match: {
                        "data": {
                            $elemMatch: {
                                "fieldName": "full_name",
                                "fieldValue": { $regex: regex }
                            }
                        }
                    }
                }
            )
        }

        const result = await leadModel.aggregate(pipeline)

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Data fetched successfully",
            data: result
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default searchResult;