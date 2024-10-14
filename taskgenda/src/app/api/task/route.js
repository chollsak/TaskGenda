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

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return new Response(JSON.stringify({ success: false, msg: 'Invalid Task ID' }), { status: 400 });
        }

        const data = await req.json(); // Retrieve updated task data from the request body

        const updatedTask = await Task.findByIdAndUpdate(taskId, data, { new: true }); // Pass the updated task data

        if (!updatedTask) {
            return new Response(JSON.stringify({ success: false, msg: 'Task not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, task: updatedTask }), { status: 200 });

    } catch (error) {
        console.error("Server error:", error); // Log the exact error on the server for debugging
        return new Response(JSON.stringify({ success: false, msg: 'Server error', error: error.message }), { status: 500 });
    }
}
