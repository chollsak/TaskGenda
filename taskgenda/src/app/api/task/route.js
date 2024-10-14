import mongoose from "mongoose";
import User from "../../../../models/user";
import Task from "../../../../models/task";
import { connectMongoDB } from "../../../../lib/mongodb";

export async function GET(req) {
    try {
        await connectMongoDB();  // Ensure MongoDB is connected

        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get('taskId');

        if (!taskId) {
            return new Response(JSON.stringify({ success: false, msg: 'ID not found' }), { status: 400 });
        }

        // Ensure taskId is a valid MongoDB ObjectId before querying the database
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return new Response(JSON.stringify({ success: false, msg: 'Invalid Task ID' }), { status: 400 });
        }

        const task = await Task.findById(taskId); // Retrieve the task by ID

        if (!task) {
            return new Response(JSON.stringify({ success: false, msg: 'Task not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, task }), { status: 200 });

    } catch (error) {
        console.error("Server error:", error); // Log the exact error on the server for debugging
        return new Response(JSON.stringify({ success: false, msg: 'Server error', error: error.message }), { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectMongoDB();  // Ensure MongoDB is connected

        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get('taskId');

        if (!taskId) {
            return new Response(JSON.stringify({ success: false, msg: 'ID not found' }), { status: 400 });
        }

        const data = await req.json(); // Retrieve updated task data from the request body
        console.log("Received task data for update:", data);  // Debugging

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            data,  // Pass the updated task data, including dueDate
            { new: true }
        );

        if (!updatedTask) {
            return new Response(JSON.stringify({ success: false, msg: 'Task not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, task: updatedTask }), { status: 200 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ success: false, msg: 'Server error', error: error.message }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
      await connectMongoDB();
  
      const { email, task } = await req.json();
  
      console.log("Task received in backend:", task);  // Check if dueDate is received
  
      if (!email || !task || !task.name || !task.description) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email, task name, and description are required",
          }),
          { status: 400 }
        );
      }
  
      const newTask = new Task({
        name: task.name,
        description: task.description,
        status: task.status || 'in process',
        dateCreated: task.dateCreated || Date.now(),
        dueDate: task.dueDate || null,  // Check if dueDate is set properly
      });
  
      console.log("New Task being saved:", newTask);  // Log before saving
  
      await newTask.save();
  
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $push: { tasks: newTask._id } },
        { new: true, runValidators: true }
      ).populate('tasks');
  
      if (!updatedUser) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User not found",
          }),
          { status: 404 }
        );
      }
  
      return new Response(
        JSON.stringify({
          success: true,
          message: "Task added successfully",
          data: updatedUser,
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Server error", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
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
  