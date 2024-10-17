'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import LoadingComponent from '../components/Loading';
import Card from '../components/Card';
import Grid from '@mui/material/Grid';
import { Box, Tooltip } from '@mui/material';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import AddBoxIcon from '@mui/icons-material/AddBox';

function TasksPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userEmail = session?.user?.email; // Use the user's email from the session
        if (!userEmail) {
          throw new Error('No user email found.');
        }

        const res = await fetch(`/api/user?email=${userEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await res.json();
        setTasks(data.data.tasks); // Assuming tasks are inside the 'data' field
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.email) {
      fetchTasks(); // Fetch tasks when session is authenticated and user email is available
    }
  }, [session?.user?.email, status]);


  const handleDelete = async (taskId) => {

    try {

      if (!confirm(`Are u sure to delete task id : ${taskId}`)) {
        return
      }

      const resDelete = await fetch(`/api/task?taskId=${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!resDelete) {
        throw new Error('Failed to delete task')
      }

      // Update the tasks state after deletion
      setTasks(tasks.filter((task) => task._id !== taskId));
      alert(`Task id : ${taskId} deleted!!`)

    } catch (error) {
      console.error('Error deleting task:', error);
    }

  }

  const handleTaskClick = (taskId) => {
    router.push(`/task-detail/${taskId}`)
  }

  const checkStatus = (status) => {
    switch (status) {
      case 'in process':
        return `text-yellow-600 font-semibold`
      case 'success':
        return `text-green-600 font-semibold`
    }
  }

  return (
    <div className='mb-8 '>
      {/* Navbar is always visible */}
      <Navbar session={session} />

      <div className="container mx-auto">
        <div className='flex justify-between'>
          <h3 className="text-2xl font-bold my-4"><SplitscreenIcon className='-mt-1.5 mr-1'/>All Tasks</h3>
          <button
            onClick={() => { router.push('/add-task') }}
            className="my-3 px-2 bg-green-600 text-white rounded-md"
          >
          <Tooltip title='Add Task'><AddBoxIcon/></Tooltip>
           
          </button>
        </div>

        {/* Display loading message */}
        {loading ? (
          <div><LoadingComponent /></div>
        ) : error ? (
          /* Display error message if there is an error */
          <p>Error loading tasks: {error}</p>
        ) : tasks.length > 0 ? (
          /* Display tasks if they exist */
          <Box>
            <Grid container spacing={1} sx={{width:'78%'}}>
              {tasks.map((task) => (
                <Grid item xs={2.4} key={task._id}>  {/* Adjust the xs value to fit 5 cards per row */}
                  <Card task={task} />  {/* Pass the task name to the Card component */}
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          /* Display message if there are no tasks */
          <p>No tasks assigned.</p>
        )}


      </div>
    </div>
  );
}

export default TasksPage;
