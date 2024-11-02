'use client';
import Navbar from './components/Navbar';
import { useSession } from 'next-auth/react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ListAltIcon from '@mui/icons-material/ListAlt';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main className="bg-gray-100 min-h-screen">
      <Navbar session={session} />
      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="bg-blue-600 text-white rounded-lg shadow-md p-8 text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to TaskGenda</h1>
          <p className="text-lg mb-4">
            Manage your tasks efficiently and stay on top of your responsibilities.
          </p>
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="contained"
              color="inherit"
              className="bg-white text-blue-600 hover:bg-gray-200"
              startIcon={<AddTaskIcon />}
              onClick={() => router.push('/tasks')}
            >
              Create Task
            </Button>
            <Button
              variant="contained"
              color="inherit"
              className="bg-white text-blue-600 hover:bg-gray-200"
              startIcon={<ListAltIcon />}
              onClick={() => router.push('/dashboard')}
            >
              View Tasks
            </Button>
          </div>
        </div>

        {/* Class Card Style Inspired by Google Classroom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Task Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Personal Projects</h3>
            <p className="text-gray-600">Keep track of your personal tasks and deadlines.</p>
            <div className="mt-4 text-sm text-blue-500 font-medium">View Details</div>
          </div>
          {/* Task Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Team Collaboration</h3>
            <p className="text-gray-600">Manage tasks and collaborate with your team effectively.</p>
            <div className="mt-4 text-sm text-blue-500 font-medium">View Details</div>
          </div>
          {/* Task Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Upcoming Deadlines</h3>
            <p className="text-gray-600">Stay informed of upcoming due dates and plan accordingly.</p>
            <div className="mt-4 text-sm text-blue-500 font-medium">View Details</div>
          </div>
        </div>
      </div>
    </main>
  );
}
