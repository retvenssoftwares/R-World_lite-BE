import userModel from "../../models/userModel.js";
import ErrorHandler from '../../middleware/errorHandler.js';
import favouriteModel from "../../models/favourite.js";

const addToFav = async (req, res, next) => {
    try {
        const userId = req.authData.userId;
        const leadId = req.body.leadId;
        const displayStatus = +req.body.displayStatus;

        const findUser = await userModel.findOne({ userId: userId });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }

        if (!leadId) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: "provide lead Id",
            });
        }
        const findFAV = await favouriteModel.findOne({ userId: userId, leadId: leadId });

        if (findFAV && displayStatus === 0) {

            await favouriteModel.deleteOne({ userId: userId, leadId: leadId });
            return res.status(200).json({
                status: true,
                code: 200,
                message: "Remove from favourites",
            });
        }

        if (findFAV) {
            return res.status(200).json({
                status: true,
                code: 200,
                message: "Already in favourites",
            });
        }

        const addToFav = new favouriteModel({
            userId: userId,
            leadId: leadId,
        })

        await addToFav.save();

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Added to favourite successfully",
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default addToFav;