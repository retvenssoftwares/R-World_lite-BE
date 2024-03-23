import mongoose from "mongoose"

const user = new mongoose.Schema({
    userId: {
        type: String,
        default: ""
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    profileImg: {
        type: String,
        default: ""
    },
    role: {
        type: String, enum: ["INTERNAL", "EXTERNAL"],
        default: "INTERNAL"
    },
    designation: {
        type: String, enum: ["ADMIN", "DIRECTORS", "SALES_MANAGER", "SALES_EXECUTIVE", "MARKETING_MANAGER", "MARKETING_EXECUTIVE", "REVENUE_MANAGER", "REVENUE_EXECUTIVE", "TECHNOLOGY_MANAGER", "TECHNOLOGY_EXECUTIVE", "CLIENT"],
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    createdOn: {
        type: String,
        default: ""
    },
    isVerified: {
        type: String,
        default: "true"
    },
    addedBy: {
        type: String,
        default: "ADMIN"
    },
    leaderId: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
}, {
    versionKey: false,
})
const userModel = mongoose.model("user", user)
export default userModel 