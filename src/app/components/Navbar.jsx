import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

function Navbar({session}) {
  return (
    <nav className='bg-[#333] text-white p-5'>
        <div className='container mx-auto '>
            <div className='flex justify-between items-center'>
                <div>
                    <Link href='/'>TaskGenda</Link>
                </div>
                <ul className='flex '>
                {!session ?(
                    <><li className='mx-3'>
                        <Link href='/sign-in'>Sign In</Link>
                    </li>
                    <li className='mx-3'>
                        <Link href='/sign-up'>Sign Up</Link>
                    </li></>

                ):(
                    <>
                        <li className='mx-3 flex-col'>
                            <a href='/welcome' className='bg-grey-500 text-white rounded-md border py-2 px-3 text-lg my-2 hover:cursor-pointer'>Profile</a>
                        </li>
                        <li className='mx-3 flex-col'>
                            <a href='/tasks' className='bg-grey-500 text-white rounded-md border py-2 px-3 text-lg my-2 hover:cursor-pointer'>Tasks</a>
                        </li>
                        <li className='mx-3'>
                            <a onClick={() => signOut()} className='bg-red-500 text-white rounded-md border py-2 px-3 text-lg my-2 hover:cursor-pointer'>Sign Out</a>
                        </li>    
                    </>
                )}
                </ul>
            </div>
        </div>
    </nav>
  )
}

export default Navbar