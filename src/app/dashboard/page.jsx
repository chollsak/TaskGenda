'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { Box } from '@mui/material';
import LoadingComponent from '../components/Loading';

function WelcomePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [inProcessTasks, setInProcessTasks] = useState([]);
  const [successTasks, setSuccessTasks] = useState([]);
  const [pastDueTasks, setPastDueTasks] = useState([]);
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
        const userEmail = session?.user?.email;
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

        // Filter tasks based on status and due date
        const inProcess = data.data.tasks.filter((task) => task.status === 'in process');
        const success = data.data.tasks.filter((task) => task.status === 'success');
        const pastDue = data.data.tasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate < new Date() && task.status !== 'success'; // Ensure only past due tasks that are not 'success'
        });

        setInProcessTasks(inProcess);
        setSuccessTasks(success);
        setPastDueTasks(pastDue);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.email) {
      fetchTasks();
    }
  }, [session?.user?.email, status]);

  if (loading) {
    return <div><LoadingComponent/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar session={session} />
      <div className="container mx-auto mb-10">
        <h5 className="text-3xl my-3">Welcome, {session?.user?.name}</h5>
        <p>Email: {session?.user?.email}</p>
        <hr className="my-3" />

        {/* Display 'in process' tasks */}
        <h6 className="text-xl my-3">Tasks in Process</h6>
        {inProcessTasks.length > 0 ? (
          <Box 
            className="flex overflow-x-auto space-x-2 rounded-lg" 
            sx={{ maxWidth: '100%', padding: '8px', border: '2px solid #eab308' }}
          >
            {inProcessTasks.map((task) => (
              <div key={task._id} className="flex-shrink-0">
                <Card task={task} />
              </div>
            ))}
          </Box>
        ) : (
          <p>No tasks in process.</p>
        )}

        {/* Display 'success' tasks */}
        <h6 className="text-xl my-3">Completed Tasks</h6>
        {successTasks.length > 0 ? (
          <Box 
            className="flex overflow-x-auto space-x-2 rounded-lg" 
            sx={{ maxWidth: '100%', padding: '8px', border: '2px solid #16a34a' }}
          >
            {successTasks.map((task) => (
              <div key={task._id} className="flex-shrink-0">
                <Card task={task} />
              </div>
            ))}
          </Box>
        ) : (
          <p>No completed tasks.</p>
        )}

        {/* Display 'passed due' tasks */}
        <h6 className="text-xl my-3">Past Due Tasks</h6>
        {pastDueTasks.length > 0 ? (
          <Box 
            className="flex overflow-x-auto space-x-2 rounded-lg" 
            sx={{ maxWidth: '100%', padding: '8px', border: '2px solid #ef4444' }}
          >
            {pastDueTasks.map((task) => (
              <div key={task._id} className="flex-shrink-0">
                <Card task={task} />
              </div>
            ))}
          </Box>
        ) : (
          <p>No past due tasks.</p>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
