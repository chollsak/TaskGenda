'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

function AddTaskPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [task, setTask] = useState({
    name: '',
    description: '',
    status: 'in process',
    dateCreated: new Date().toISOString(),
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userEmail = session?.user?.email;
      if (!userEmail) {
        throw new Error('No user email found.');
      }

      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, task }),
      });

      if (!res.ok) {
        throw new Error('Failed to add task');
      }

      // Navigate back to tasks page after successful addition
      router.push('/tasks');
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar session={session} />

      <div className="container mx-auto">
        <h3 className="text-2xl font-bold mb-4">Add a New Task</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Task Name</label>
            <input
              type="text"
              name="name"
              value={task.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="in process">In Process</option>
              <option value="success">Success</option>
              <option value="done">Done</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Task
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddTaskPage;
