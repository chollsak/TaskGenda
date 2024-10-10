'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

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

  return (
    <div>
      {/* Navbar is always visible */}
      <Navbar session={session} />

      <div className="container mx-auto">
      <div className='flex justify-between'>
      <h3 className="text-2xl font-bold my-4">Your Tasks</h3>
        <button
          onClick={() => router.push('/add-task')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add New Task
        </button>
      </div>

        {/* Display loading message */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          /* Display error message if there is an error */
          <p>Error loading tasks: {error}</p>
        ) : tasks.length > 0 ? (
          /* Display tasks if they exist */
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="border-b py-2">
                <h4 className="font-semibold">{task.name}</h4>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <p>Date Created: {new Date(task.dateCreated).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          /* Display message if there are no tasks */
          <p>No tasks assigned.</p>
        )}

      </div>
    </div>
  );
}

export default TasksPage;
