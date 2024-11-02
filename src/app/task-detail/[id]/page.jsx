'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Modal, Box, TextField, Button, Select, MenuItem, FormControl } from '@mui/material';

// Fetch task data
async function fetchData(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/task?taskId=${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error('Failed to fetch task');

    return await res.json();
  } catch (error) {
    return { success: false, msg: error.message };
  }
}

function TaskDetailPage() {
  const router = useRouter();
  const session = useSession();
  const { id } = useParams(); // Extract the task ID from the URL
  const [task, setTask] = useState(null); // State to store task data
  const [loading, setLoading] = useState(true); // State for loading status
  const [openModal, setOpenModal] = useState(false); // State for modal visibility
  const [updatedTask, setUpdatedTask] = useState({
    name: '',
    description: '',
    status: '',
    dueDate: '',
  });

  // Fetch task data when the component mounts
  useEffect(() => {
    if (id) {
      fetchData(id).then((data) => {
        if (data.success) {
          setTask(data.task);
          setUpdatedTask({
            name: data.task.name,
            description: data.task.description,
            status: data.task.status,
            dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString().split('T')[0] : '',
          });
        } else {
          console.error(data.msg);
        }
        setLoading(false);
      });
    }
  }, [id]);

  // Handle modal visibility
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle form field changes
  const handleChange = (e) => {
    setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
  };

  // Handle task deletion
  const handleDelete = async (taskId) => {
    try {
      if (!confirm(`Are you sure you want to delete task id: ${taskId}?`)) return;

      const resDelete = await fetch(`/api/task?taskId=${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!resDelete.ok) throw new Error('Failed to delete task');

      alert(`Task id: ${taskId} deleted!!`);
      router.push('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle task update submission
  const handleSubmit = async (taskId) => {
    const updatedData = {
      name: updatedTask.name || task.name,
      description: updatedTask.description || task.description,
      status: updatedTask.status || task.status,
      dueDate: updatedTask.dueDate || task.dueDate,
    };

    try {
      const resUpdate = await fetch(`/api/task?taskId=${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!resUpdate.ok) throw new Error('Failed to update task');

      alert(`Task id: ${taskId} updated!!`);
      router.push('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
    }

    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/img/loader.gif" alt="Loading" className="w-40" />
      </div>
    );
  }

  return (
    <div>
      <Navbar session={session} />
      <div className="container mx-auto mt-5 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Task Details for: {id}</h1>
          <div className="flex items-center text-blue-500 cursor-pointer" onClick={handleOpenModal}>
            <EditNoteIcon className="mr-1" />
            <p className="hover:underline">Edit Task</p>
          </div>
        </div>
        {task ? (
          <div className="bg-white p-6 shadow rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">{updatedTask.name || task.name}</h2>
            <p className="whitespace-pre-line mb-2">{updatedTask.description || task.description}</p>
            <p className="text-gray-600">Date Created: {task.dateCreated}</p>
            <p className="text-gray-600">Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
            <p className="text-gray-600">Status: {updatedTask.status || task.status}</p>
            <button
              onClick={() => handleDelete(task._id)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ) : (
          <p className="text-red-500">Task not found.</p>
        )}

        {/* Modal */}
        <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title" aria-describedby="modal-description">
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
            className="rounded-lg"
          >
            <h2 id="modal-title" className="text-xl font-semibold mb-4">Edit Task</h2>
            <FormControl fullWidth>
              <TextField
                label="Name"
                name="name"
                value={updatedTask.name || ''}
                onChange={handleChange}
                margin="normal"
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={updatedTask.description || ''}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="Due Date"
                type="date"
                name="dueDate"
                value={updatedTask.dueDate || ''}
                onChange={handleChange}
                margin="normal"
                fullWidth
              />
              <p className="mt-4">Status</p>
              <Select
                name="status"
                value={updatedTask.status || ''}
                onChange={handleChange}
                fullWidth
                className="mt-2"
              >
                <MenuItem value="in process">In Process</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleSubmit(id)}
                className="mt-4 bg-black text-white hover:bg-gray-800"
              >
                Save Changes
              </Button>
            </FormControl>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default TaskDetailPage;
