import react, { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Box } from '@mui/material'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';

function Navbar({ session }) {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter()

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <div className='mb-20'>
            <nav className='bg-[#1c2d38] text-white p-5 fixed top-0 left-0 w-full z-50'>
                <div className='container mx-auto'>
                    <div className='flex justify-between items-center'>
                        <div>
                            {/* Adjusting the size of the logo with width and height */}
                            <Box component='img' src='/img/taskgenda_logo.png' alt="Logo" onClick={() => (router.push('/'))} className='w-32 h-auto hover:cursor-pointer' />
                        </div>
                        <ul className='flex'>
                            {!session ? (
                                <>
                                    <li className='mx-3'>
                                        <Link href='/sign-in' className='text-sm'>Sign In</Link>
                                    </li>
                                    <li className='mx-3'>
                                        <Link href='/sign-up' className='text-sm'>Sign Up</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className='mx-3'>
                                        <a href='/welcome' className='bg-gradient-to-r from-[#00fca8] to-[#1cdaff] text-gray-500 rounded-md border border-white border-solid py-2 px-4 text-sm hover:text-black hover:opacity-95'>Dashboard</a>                </li>
                                    <li className='mx-3'>
                                        <a href='/tasks' className='bg-gradient-to-r from-[#00fca8] to-[#1cdaff] text-gray-500 rounded-md border border-white border-solid py-2 px-4 text-sm hover:text-black hover:opacity-95'>Tasks</a>
                                    </li>

                                    <Tooltip title='setting'>
                                    <button onClick={toggleDropdown}>
                                        <SettingsApplicationsIcon className='text-[#00fca8] hover:text-[#1cdaff] '/>
                                    </button>
                                    </Tooltip>
                                    {isDropdownOpen && (
                                        <ul className='absolute right-8 mt-10 w-40 bg-white text-black shadow-lg rounded-lg py-2'>
                                            <li className='px-4 py-2 hover:bg-gray-200'>
                                                <a className='text-sm'>Profile</a>
                                            </li>
                                            <li className='px-4 py-2 hover:bg-gray-200'>
                                                <a className='text-sm'>About</a>
                                            </li>
                                            <hr class="border-t-2 border-[#00fca8] my-4" />
                                            <li className='px-4 py-2 hover:bg-gray-200'>
                                                <a onClick={() => signOut()} className='text-sm text-red-700'>Sign Out</a>
                                            </li>
                                        </ul>
                                    )}


                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;
