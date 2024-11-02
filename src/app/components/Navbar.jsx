import react, { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Box, Typography } from '@mui/material'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';
import { Roboto } from 'next/font/google';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Configure the font
const roboto = Roboto({
    weight: ['400', '500', '700'],  // Choose the required font weights
    subsets: ['latin'],  // Choose the character set needed
});

function Navbar({ session }) {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter()

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <div className='mb-24'>
            <nav className='bg-white text-gray-600 p-5 fixed top-0 left-0 w-full z-50 border-b border-gray-300'>
                <div className='container mx-auto'>
                    <div className='flex justify-between items-center'>
                        <div className='flex'>
                            {/* Adjusting the size of the logo with width and height */}
                            <SplitscreenIcon className=' mr-1'/>
                            <Typography
                                variant='h6'
                                onClick={() => router.push('/')}
                                className={`w-32 h-auto hover:cursor-pointer ${roboto.className}`} // Apply the font
                            >
            
                                TASKGENDA
                            </Typography>
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
                                    <Link href={'/dashboard'} className='mx-3 flex hover:cursor-pointer text-blue-400'>
                                        <DashboardIcon/>
                                        <Typography fontSize={'small'} className='mt-1'>DASHBOARD</Typography>
                                    </Link>
                                    <div>|</div>
                                    <Link href={'/tasks'} className='mx-3 flex hover:cursor-pointer text-yellow-400'>
                                        <AssignmentIcon/>
                                        <Typography fontSize={'small'} className='mt-1'>TASKS</Typography>
                                    </Link>

                                    <div>|</div>

                                    <Tooltip title='setting'>
                                        <button onClick={toggleDropdown}>
                                            <SettingsApplicationsIcon className='ml-3 mb-1' />
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
                                            <hr class="border-t-2 border-gray-600 my-4" />
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
