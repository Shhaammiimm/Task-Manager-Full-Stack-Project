import TaskModel from "../model/TaskModel.js";
import mongoose from "mongoose";

export const CreateTask = async (req, res) => {
  try {
    const reqBody = { ...req.body, user_id: req.user._id };
    const task = await TaskModel.create(reqBody);
    return res.status(200).json({ status: "success", Message: "CreateTask", Data: task });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const UpdateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const reqBody = req.body;
    const user_id = req.user._id;
    const task = await TaskModel.findOneAndUpdate({ _id: id, user_id }, reqBody, { new: true });
    if (!task) return res.status(400).json({ status: "fail", Message: "Task Not Found" });
    return res.status(200).json({ status: "success", Message: "UpdateTask", Data: task });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const UpdateTaskStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    const user_id = req.user._id;
    const task = await TaskModel.findOneAndUpdate({ _id: id, user_id }, { status }, { new: true });
    if (!task) return res.status(400).json({ status: "fail", Message: "Task Not Found" });
    return res.status(200).json({ status: "success", Message: "UpdateTaskStatus", Data: task });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const TaskListByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const user_id = req.user._id;
    const task = await TaskModel.find({ status, user_id }).sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", Message: "TaskListByStatus", Data: task || [] });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const DeleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.user._id;
    const task = await TaskModel.findOneAndDelete({ _id: id, user_id });
    if (!task) return res.status(400).json({ status: "fail", Message: "Task Not Found" });
    return res.status(200).json({ status: "success", Message: "DeleteTask", Data: task });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};

export const CountTask = async (req, res) => {
  try {
    const user_id = req.user._id;
    const user_id_obj = new mongoose.Types.ObjectId(user_id);
    const task = await TaskModel.aggregate([
      { $match: { user_id: user_id_obj } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    return res.status(200).json({ status: "success", Message: "CountTask", Data: task });
  } catch (err) {
    return res.status(400).json({ status: "fail", Message: err.message });
  }
};
