'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import { useSession } from 'next-auth/react'
import { redirect } from "next/navigation";

function WelcomePage() {

    const { data: session } = useSession()

    if(!session){
        redirect('/sign-in')
    }

    console.log(session)

  return (
    <div>
        <Navbar session={session}/>
        <div className='container mx-auto'>
            <h5 className='text-3xl my-3'>Welcome, {session?.user?.name}</h5>
            <p>Email: {session?.user?.email}</p>
            <p>Tasks: </p>
            <hr className='my-3'/>
            <p>Hello World</p>
        </div>
    </div>
  )
}

export default WelcomePage