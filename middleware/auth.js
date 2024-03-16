import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import ErrorHandler from './errorHandler.js';

async function signJwt(payloadData) {
    const jwtPayload = payloadData;

    const addToken = { ...payloadData };

    // JWT token with Payload and secret.
    addToken.token = JWT.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_TIMEOUT_DURATION,
    });

    return addToken;
}

async function verifyJwt(req, res, next) {
    const { authorization } = req.headers;

    try {
        if (!authorization) {
            return res.status(401).json({
                success: false,
                code: 401,
                message: "Not Authorized",
            });
        } else if (authorization) {
            const verifyValidToken = JWT.decode(authorization);

            if (!verifyValidToken) {
                return res
                    .status(401)
                    .json({ success: false, code: 401, message: "Not Authorized" });
            } else {
                const decoded = await JWT.verify(
                    authorization,
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        ignoreExpiration: true,
                    }
                );

                const findUserWithAuth = await userModel.findOne({
                    email: decoded.email,
                }).lean();

                if (findUserWithAuth) {
                    req.authData = decoded;
                    next();
                } else {
                    return res
                        .status(401)
                        .json({ status: false, code: 401, message: "Not Authorized" });
                }
            }
        }
    } catch (error) {
        if (error.message === "invalid signature") {
            return res
                .status(401)
                .json({ status: false, code: 401, message: "Not Authorized" });
        } else {
            return next(new ErrorHandler(error.message, 500));
        }
    }
}
export { signJwt, verifyJwt }