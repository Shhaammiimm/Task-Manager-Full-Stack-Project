import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, default: null }
}, {
    timestamps: true,
    versionKey: false
});

const UsersModel = mongoose.model("users", userSchema);
export default UsersModel;
