import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    name: { type: String },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

const taskSchema = mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    priority: { type: String },
    progress: { type: String },
    assignedTo: { type: String },
    startDate: { type: Date },
    dateDue: { type: Date },
    comment: [commentSchema],
  },
  {
    timestamp: true,
  }
);

export const Task = mongoose.model("Task", taskSchema);
