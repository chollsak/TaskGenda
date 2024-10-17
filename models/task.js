import mongoose from "mongoose";
import { Schema } from "mongoose";
import { type } from "os";

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
  dueDate:{
    type: Date,
    require: true,
    default: null
  },
  status: {
    type: String,
    enum: ['in process', 'success', 'passed due'], // Ensures status is one of these values
    required: true,
    default: 'in process' // Default value for status
  }
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
