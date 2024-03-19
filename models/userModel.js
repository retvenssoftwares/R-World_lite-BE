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
        type: String,enum:["INTERNAL", "EXTERNAL"],
        default: "INTERNAL"
    },
    designation: {
        type: String, enum: ["SUPERADMIN", "DIRECTORS", "SALESMANAGER", "SALESEXECUTIVE", "MARKETINGMANAGER", "MARKETINGEXECUTIVE", "REVENUEMANAGER", "REVENUEEXECUTIVE", "TECHNOLOGYMANAGER", "TECHNOLOGYEXECUTIVE", "CLIENT"],
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
},
    {
        versionKey: false,
    })
const userModel = mongoose.model("user", user)
export default userModel 