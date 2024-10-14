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

