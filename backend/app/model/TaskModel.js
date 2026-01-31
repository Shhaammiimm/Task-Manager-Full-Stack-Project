import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true;
          const year = value.getFullYear();
          return year >= 2000 && year <= 2100;
        },
        message: "dueDate must be between year 2000 and 2100",
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  { timestamps: true, versionKey: false }
);

const TaskModel = mongoose.model("task", TaskSchema);
export default TaskModel;
