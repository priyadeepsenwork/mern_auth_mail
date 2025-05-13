import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    lastLoginDate: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false 
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)

//timestamps: true ==> createdAt and updatedAt will be
//added in the schema automatically by mongoose

