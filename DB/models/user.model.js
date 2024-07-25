import { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recoveryEmail: { type: String},
    DOB: { type: Date, required: true },
    mobileNumber: { type: Number, required: true, unique: true },
    role: {type: String,enum: [systemRoles.USER,systemRoles.Company_HR],default: systemRoles.USER,require:true},
    status: { type: String, enum: ['online', 'offline'], required: true },
}, { timestamps: true })

const User = model('User', userSchema)

export default User
