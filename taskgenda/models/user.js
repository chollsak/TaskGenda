import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure email is unique for each user
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'], // Limit roles to 'user' and 'admin'
    default: 'user'
  },
  tasks: [
    {
      type: Schema.Types.ObjectId, // Reference to Task model
      ref: 'Task' // Reference to the 'Task' model
    }
  ]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
