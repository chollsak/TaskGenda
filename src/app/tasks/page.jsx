'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import LoadingComponent from '../components/Loading';
import Card from '../components/Card';
import Grid from '@mui/material/Grid';
import { Box, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import AddBoxIcon from '@mui/icons-material/AddBox';

function TasksPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // State to store the selected filter option
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
        setTasks(data.data.tasks); // Assuming tasks are inside the 'data' field
        setFilteredTasks(data.data.tasks); // Set filteredTasks to the complete task list initially
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

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
  
    let filtered = [...tasks];
  
    if (selectedFilter === 'nearest') {
      // Sort tasks to prioritize those with a due date first, and then sort by the nearest date
      filtered = filtered.sort((a, b) => {
        const aHasDueDate = !!a.dueDate;
        const bHasDueDate = !!b.dueDate;
  
        // Prioritize tasks with due dates
        if (aHasDueDate && !bHasDueDate) return -1;
        if (!aHasDueDate && bHasDueDate) return 1;
  
        // If both tasks have due dates, sort by the nearest date
        if (aHasDueDate && bHasDueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
  
        // If neither have due dates, keep the order the same
        return 0;
      });
    } else if (selectedFilter === 'in process') {
      filtered = filtered.filter((task) => task.status === 'in process');
    } else if (selectedFilter === 'success') {
      filtered = filtered.filter((task) => task.status === 'success');
    } else {
      filtered = tasks; // 'all' filter to show all tasks
    }
  
    setFilteredTasks(filtered);
  };
  

  const handleDelete = async (taskId) => {
    try {
      if (!confirm(`Are you sure to delete task id: ${taskId}?`)) {
        return;
      }

      const resDelete = await fetch(`/api/task?taskId=${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!resDelete.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter((task) => task._id !== taskId));
      setFilteredTasks(filteredTasks.filter((task) => task._id !== taskId));
      alert(`Task id: ${taskId} deleted!!`);

    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskClick = (taskId) => {
    router.push(`/task-detail/${taskId}`);
  };

  return (
    <div className='mb-8'>
      <Navbar session={session} />

      <div className="container mx-auto">
        <div className='flex justify-between items-center'>
          <h3 className="text-2xl font-bold my-4 flex items-center">
            <SplitscreenIcon className='-mt-1.5 mr-1'/>My Tasks
          </h3>

          <div className='flex space-x-4'>
            <FormControl variant="outlined" size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                onChange={handleFilterChange}
                label="Filter"
                className='bg-white'
              >
                <MenuItem value="all">All Tasks</MenuItem>
                <MenuItem value="nearest">Nearest Due Date</MenuItem>
                <MenuItem value="in process">In Process</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>

            <button
              onClick={() => router.push('/add-task')}
              className="px-2 bg-green-600 text-white rounded-md"
            >
              <Tooltip title='Add Task'><AddBoxIcon /></Tooltip>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Box src='/img/loader.gif' className='w-40' component={'img'} />
          </div>
        ) : error ? (
          <p className='text-red-500'>Error loading tasks: {error}</p>
        ) : filteredTasks.length > 0 ? (
          <Box>
            <Grid container spacing={1} sx={{ width: '78%' }}>
              {filteredTasks.map((task) => (
                <Grid item xs={2.4} key={task._id}>
                  <Card task={task} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <p className='text-gray-500'>No tasks assigned.</p>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
