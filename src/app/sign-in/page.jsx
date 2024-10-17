'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";

function LogInPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const {data: session} = useSession()

    const router = useRouter()

    if(session){
        router.push('/dashboard')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            const res = await signIn('credentials', {
                email, password, redirect: false
            })

            if(res.error){
                setError('Invalid credentials')
                return
            }

            alert('Logged in')
            router.push('/dashboard')
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div >
            <Navbar />
            <div className='container mx-auto my-5'>
                <h6>LogIn Page</h6>
                <hr className='my-3' />
                <form onSubmit={handleSubmit}>

                    {error && (
                        <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                            {error}
                        </div>
                    )}

                    <input onChange={(e) => setEmail(e.target.value)} className='block bg-gray-300 p-2 my-2 rounded-md' type='email' placeholder='Enter your email' />
                    <input onChange={(e) => setPassword(e.target.value)} className='block bg-gray-300 p-2 my-2 rounded-md' type='password' placeholder='Enter your password' />
                    <button type='submit' className='bg-green-500 p-2 rounded-md'>Sign In</button>
                </form>
                <hr className='my-3' />
                <p>Didn't have an account? go to <Link href='/sign-up' className='text-blue-500 hover:underline'>Register</Link> Page</p>
            </div>
        </div>
    )
}

export default LogInPage