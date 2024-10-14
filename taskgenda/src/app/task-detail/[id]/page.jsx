'use client'

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation'
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Modal, Box, TextField, Button } from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

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

        const data = await res.json(); // Corrected: parsing the response body as JSON
        return data;

    } catch (error) {
        return { success: false, msg: error.message }; // Return a consistent error object
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
    }); // State for form data

    // Fetch task data when the component mounts
    useEffect(() => {
        if (id) {
            fetchData(id).then((data) => {
                if (data.success) {
                    setTask(data.task); // Store task data if the fetch was successful
                    // Initialize updatedTask with fetched task data
                    setUpdatedTask({
                        name: data.task.name,
                        description: data.task.description,
                        status: data.task.status,
                    });
                } else {
                    console.error(data.msg);
                }
                setLoading(false); // Stop loading once data is fetched
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
        // If the user leaves any field empty, fallback to the original task data
        const updatedData = {
            name: updatedTask.name || task.name, // If empty, use original task name
            description: updatedTask.description || task.description, // If empty, use original task description
            status: updatedTask.status || task.status // If empty, use original task status
        };

        try {
            const resUpdate = await fetch(`http://localhost:3000/api/task?taskId=${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData), // Send the updated data
            });

            if (!resUpdate.ok) {
                throw new Error('Failed to update task');
            }

            alert(`Task id: ${taskId} updated!!`);
            router.push('/tasks')

        } catch (error) {
            console.error('Error updating task:', error);
        }

        handleCloseModal(); // Close the modal after submission
    };



    if (loading) {
        return <div>Loading...</div>; // Show a loading state
    }

    return (
        <div>
            <Navbar session={session} />
            <div className='container mx-auto mt-3'>
                <div className='flex justify-between'>
                    <h1>Task Details for : {id}</h1>
                    <div className='flex items-center' onClick={handleOpenModal}>
                        <EditNoteIcon className='mr-1' />
                        <p className='hover:underline hover:cursor-pointer'>Edit Task</p>
                    </div>
                </div>
                {task ? (
                    <div>
                        <h2>{updatedTask.name || task.name}</h2>
                        {/* Display `updatedTask.name` if available, else fallback to `task.name` */}

                        <p className='whitespace-pre-line'>{updatedTask.description || task.description}</p>
                        {/* Display `updatedTask.description` if available, else fallback to `task.description` */}

                        <p>{task.dateCreated}</p>
                        {/* No need for `updatedTask` here since `dateCreated` should be fixed */}

                        <p>{updatedTask.status || task.status}</p>
                        {/* Display `updatedTask.status` if available, else fallback to `task.status` */}
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
                            value={updatedTask.name || ''} // Ensuring empty string if value is undefined
                            onChange={handleChange}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={updatedTask.description || ''} // Ensuring empty string if value is undefined
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                        />

                        <p>status</p>

                        <Select
                            name="status"
                            value={updatedTask.status || ''} // Ensuring empty string if value is undefined
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
