import { signJwt } from '../../middleware/auth.js';
import bcrypt from "bcrypt"
import ErrorHandler from '../../middleware/errorHandler.js';
import userModel from '../../models/userModel.js';

const login = async (req, res, next) => {
    try {

        let email = req.body.email;
        let password = req.body.password;

        if (!email && !password) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: "Please fill all the required field",
            });
        }

        let findUser = await userModel.findOne({ email }).lean();

        if (!findUser) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "Invalid Credentials",
            });
        }

        const validatePassword = await bcrypt.compare(password, findUser.password);

        if (!validatePassword) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: "Invalid Credentials",
            });
        }

        email = findUser.email;
        password = findUser.password;
        const userId = findUser.userId;
        const phoneNumber = findUser.phoneNumber;
        const role = findUser.role;
        const profileImg = findUser.profileImg;
        const firstName = findUser.firstName;
        const lastName = findUser.lastName;
        const designation = findUser.designation;

        const jwtToken = await signJwt({
            email,
            userId,
            phoneNumber,
            role,
            profileImg,
            firstName,
            lastName,
            designation
        });

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Logged in successfully!!",
            data: jwtToken,
        });

    } catch (error) {
        console.log('error: ', error);
        return next(new ErrorHandler(error.message, 500));
    }
}

export default login 