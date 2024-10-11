// api/user/route.js

import User from "../../../../models/user";
import Task from "../../../../models/task";
import { connectMongoDB } from "../../../../lib/mongodb";
import { error } from "console";
import { headers } from "next/headers";

export async function GET(req) {
  try {
    await connectMongoDB(); // Connect to MongoDB

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); // Get the email from query parameters

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: "Email is required" }), {
        status: 400,
      });
    }

    // Find the user by email and populate the tasks
    const user = await User.findOne({ email }).populate('tasks');

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, data: user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT method to add a new task to the user's tasks array
export async function PUT(req) {
  try {
    await connectMongoDB(); // Connect to MongoDB

    const { email, task } = await req.json(); // Extract email and new task from request body

    if (!email || !task) {
      return new Response(JSON.stringify({ success: false, message: "Email and task details are required" }), {
        status: 400,
      });
    }

    // Create a new task object
    const newTask = new Task({
      name: task.name,
      description: task.description,
      status: task.status || 'in process', // Default to 'in process'
      dateCreated: task.dateCreated || Date.now(), // Default to current timestamp if not provided
    });

    // Save the new task in the Task collection
    await newTask.save();

    // Update the user's tasks array by pushing the new task
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $push: { tasks: newTask._id } }, // Push the new task ID to the user's tasks array
      { new: true, runValidators: true } // Return the updated document and validate the schema
    ).populate('tasks'); // Re-populate tasks after the update

    if (!updatedUser) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, data: updatedUser }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
  try {
    
    await connectMongoDB()
    const {searchParams} = new URL(req.url)
    const taskId = searchParams.get('taskId')
    console.log(taskId + ' id')

    if(!taskId){
      return new Response(JSON.stringify({success: false, msg: 'Task ID is required'}, {status: 400}))
    }

    const deleteTask = await Task.findByIdAndDelete(taskId)

    if(!deleteTask){
      return new Response(JSON.stringify({
        success: false,
        msg: 'Task not found'
      }, 
    {status: 404}))
    }

    return new Response(JSON.stringify({success: 'true', msg: `Task ID : ${deleteTask} deleted!`}, {
      staus: 200,
      headers: {'Content-Type' : 'application/json'}
    }))



  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}