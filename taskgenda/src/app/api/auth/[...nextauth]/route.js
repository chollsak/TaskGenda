import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from 'bcrypt'

// https://next-auth.js.org/configuration/providers/credentials
const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials, req) {

        const { email, password } = credentials

        try {

            await connectMongoDB()
            const user = await User.findOne({ email })

            if(!user){
                return null
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if(!passwordMatch){
                return null
            }

            return user
            
        } catch (error) {
            console.log("Error" , error)
        }

      }
    })
  ],
  session: {
    strategy: 'jwt', // Ensure the strategy is jwt
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure the secret is set
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Also set the secret for JWT handling
  },
  pages: {
    signIn: '/sign-in',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
