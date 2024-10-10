import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  dateCreated: { 
    type: Date,
    required: true,
    default: Date.now // Use Date.now to get the current timestamp
  },
  status: {
    type: String,
    enum: ['in process', 'success', 'done'], // Ensures status is one of these values
    required: true,
    default: 'in process' // Default value for status
  }
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
