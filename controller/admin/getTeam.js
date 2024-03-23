import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';

const getTeam = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const department = req.query.department;

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

        let pipeline = []

        if (department === "SALES") {
            pipeline.push(
                {
                    $match: {
                        department: department
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userId: 1,
                        firstName: 1,
                        designation: 1,
                    }
                }
            )
        } else {
            pipeline.push(
                {
                    $match: {
                        leaderId: userId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userId: 1,
                        firstName: 1,
                        designation: 1,
                    }
                }
            )
        }

        const findTeam = await userModel.aggregate(pipeline)

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Team fetched successfully",
            data: findTeam
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default getTeam;