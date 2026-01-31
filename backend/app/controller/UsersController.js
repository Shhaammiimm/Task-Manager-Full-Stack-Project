import UsersModel from "../model/UsersModel.js";
import { TokenEncode } from "../utility/tokenUtility.js";
import SendEmail from "../utility/emailUtility.js";

import bcrypt from "bcrypt";

export const Registration = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await UsersModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      ...rest,
    });

    return res.status(200).json({ status: "success", Message: "Registration" });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const Login = async (req, res) => {

  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await UsersModel.findOne({ email });

    console.log("LOGIN EMAIL:", email);
    console.log("USER FOUND:", user);
    if (!user) {
      return res.status(400).json({ status: "fail", Message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "fail", Message: "Invalid Password" });
    }

    const token = TokenEncode(user.email, user._id);

    return res.status(200).json({
      status: "success",
      Message: "Login Successfully",
      Token: token,
    });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const ProfileDetails = async (req, res) => {
  try {
    const user_id = req.user._id;
    const user = await UsersModel.findOne({ _id: user_id });
    if (!user) return res.status(400).json({ status: "fail", Message: "User Not Found" });
    return res.status(200).json({ status: "success", Message: "Profile Details", Data: user });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const ProfileUpdate = async (req, res) => {
  try {
    const user_id = req.user._id;
    const user = await UsersModel.findOneAndUpdate({ _id: user_id }, req.body, { new: true });
    return res.status(200).json({ status: "success", Message: "Profile Update Successfully", Data: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const EmailVerify = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await UsersModel.findOne({ email });
    if (!user) return res.json({ status: "fail", Message: "User email does not exist" });
    const code = Math.floor(100000 + Math.random() * 900000);
    const sent = await SendEmail(user.email, "Your verification code is: " + code, "Task Manager Verification Code");
    if (!sent) return res.json({ status: "fail", Message: "Email sending failed" });
    await UsersModel.updateOne({ email }, { otp: code });
    return res.json({ status: "success", Message: "Verification successfully, check email" });
  } catch (err) {
    return res.json({ status: "fail", Message: err.toString() });
  }
};

export const CodeVerify = async (req, res) => {
  try {
    const { email, code } = req.params;
    const data = await UsersModel.findOne({ email, otp: code });
    if (!data) return res.json({ status: "fail", Message: "Wrong Verification Code" });
    return res.json({ status: "success", Message: "Verification successfully" });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    const data = await UsersModel.findOne({ email, otp: code });
    if (!data) return res.json({ status: "fail", Message: "Wrong Verification Code" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await UsersModel.updateOne(
      { email },
      { otp: "0", password: hashedPassword }
    );
    return res.json({ status: "success", Message: "User ResetPassword successfully" });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};
