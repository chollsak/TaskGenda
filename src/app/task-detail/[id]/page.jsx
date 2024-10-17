'use client'

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Modal, Box, TextField, Button } from '@mui/material';
import { Select, MenuItem, FormControl } from '@mui/material';

// Fetch task data
async function fetchData(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/task?taskId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch task');
        }

        const data = await res.json();
        return data;

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
        dueDate: '',  // Added dueDate in the state
    });

    const handleDelete = async (taskId) => {
        try {
            if (!confirm(`Are you sure you want to delete task id: ${taskId}?`)) {
                return;
            }

            const resDelete = await fetch(`/api/task?taskId=${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!resDelete.ok) {
                throw new Error('Failed to delete task');
            }

            alert(`Task id: ${taskId} deleted!!`);

            // Redirect to the tasks list after successful deletion
            router.push('/tasks');

        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };



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
                        dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString().split('T')[0] : '', // Format dueDate for date input
                    });
                } else {
                    console.error(data.msg);
                }
                setLoading(false);
            });
        }
    }, [id]);

    // Handle opening and closing of the modal
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // Update form fields when typing
    const handleChange = (e) => {
        setUpdatedTask({
            ...updatedTask,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (taskId) => {
        const updatedData = {
            name: updatedTask.name || task.name,
            description: updatedTask.description || task.description,
            status: updatedTask.status || task.status,
            dueDate: updatedTask.dueDate || task.dueDate // Include dueDate in the updated data
        };

        try {
            const resUpdate = await fetch(`/api/task?taskId=${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData),
            });

            if (!resUpdate.ok) {
                throw new Error('Failed to update task');
            }

            alert(`Task id: ${taskId} updated!!`);
            router.push('/tasks');

        } catch (error) {
            console.error('Error updating task:', error);
        }

        handleCloseModal();
    };

    if (loading) {
        return <div className='flex items-center justify-center h-screen'><Box src='/img/loader.gif' className='w-40' component={'img'}/></div>;
    }

    return (
        <div>
            <Navbar session={session} />
            <div className='container mx-auto mt-3'>
                <div className='flex justify-between'>
                    <h1>Task Details for: {id}</h1>
                    <div className='flex items-center' onClick={handleOpenModal}>
                        <EditNoteIcon className='mr-1' />
                        <p className='hover:underline hover:cursor-pointer'>Edit Task</p>
                    </div>
                </div>
                {task ? (
                    <div>
                        <h2>{updatedTask.name || task.name}</h2>
                        <p className='whitespace-pre-line'>{updatedTask.description || task.description}</p>
                        <p>{task.dateCreated}</p>
                        <p>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                        <p>{updatedTask.status || task.status}</p>
                        {task && (
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="p-2 mt-5 mb-14 bg-red-500 text-white rounded-md"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                ) : (
                    <p>Task not found.</p>
                )}
            </div>


            {/* Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
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
                >
                    <h2 id="modal-title">Edit Task</h2>
                    <FormControl>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={updatedTask.name || ''}
                            onChange={handleChange}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={updatedTask.description || ''}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                        />

                        <TextField
                            fullWidth
                            label="Due Date"
                            type="date" // This makes it a date picker
                            name="dueDate"
                            value={updatedTask.dueDate || ''}
                            onChange={handleChange}
                            margin="normal"
                        />

                        <p>Status</p>

                        <Select
                            name="status"
                            value={updatedTask.status || ''}
                            onChange={handleChange}
                            className='mt-4'
                        >
                            <MenuItem value="in process">In Process</MenuItem>
                            <MenuItem value="success">Success</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                        </Select>
                        <Button
                            variant="contained"
                            size='sm'
                            onClick={() => handleSubmit(id)}
                            sx={{ mt: 2, bgcolor: 'black' }}
                        >
                            <span className='text-xs'>Save Changes</span>
                        </Button>
                    </FormControl>
                </Box>
            </Modal>
        </div>
    );
}

export default TaskDetailPage;
