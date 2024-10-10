import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from 'bcrypt'


export async function POST(req) {
    try {
        const {name, email, password} = await req.json()
        const hashedPassword = await bcrypt.hash(password, 10)

        await connectMongoDB()

        await User.create({ name, email, password: hashedPassword })

        return NextResponse.json({msg: 'User registerd.'}, {status: 200})

    } catch (error) {
        return NextResponse.json({msg: 'An error occured while registrating the user.'}, {status: 500})
    }
}