import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

export async function GET(req, {params}){
    const {id} = params

    try {
        await connectMongoDB()
        const user = await User.findById(id).populate('tasks')

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
          }
      
          return new Response(JSON.stringify(user), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), { status: 500 });
    }
}