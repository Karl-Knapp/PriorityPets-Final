const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["0", "1", "2"],
      default: "1",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: false,
    },
    reminder: {
      type: Date,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
