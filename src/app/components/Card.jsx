import React from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import TodayIcon from '@mui/icons-material/Today';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Tooltip from '@mui/material/Tooltip';

export default function Card({ task }) {

    const router = useRouter()

  // Helper function to split the task name while keeping word boundaries
  const formatName = (name) => {
    if (!name) return ['No Task Name', ''];  // Handle empty names

    // Split based on word boundaries
    const splitAtSpace = (str, maxLength) => {
      if (str.length <= maxLength) return str;
      const indexOfLastSpace = str.lastIndexOf(' ', maxLength);
      return indexOfLastSpace !== -1 ? str.substring(0, indexOfLastSpace) : str.substring(0, maxLength);
    };

    const firstLine = splitAtSpace(name, 10);  // First 10 characters with word boundaries
    let secondLine = name.substring(firstLine.length).trim();  // Remaining part of the string after the first line

    secondLine = splitAtSpace(secondLine, 22);  // Next 20 characters with word boundaries
    if (name.length > firstLine.length + secondLine.length) {
      secondLine = `${secondLine.substring(0, 22)}...`;  // Truncate if more than 20 chars on the second line
    }

    return [firstLine, secondLine];
  };

  const [firstLine, secondLine] = formatName(task?.name);

  const handleTaskClick = (taskId) => {
    router.push(`/task-detail/${taskId}`)
  }

  const checkStatus = (status) => {
    switch(status){
        case "in process":
            return (<Tooltip title='in process'><PendingActionsIcon className='mb-0.5 text-yellow-500' /></Tooltip>)
        case "success":
            return (<Tooltip title='success'><AssignmentTurnedInIcon className='mb-0.5 text-green-600'/></Tooltip>)
    }
  }


  return (
    <div className='mx-1 my-3'>
      <Box className='rounded-lg border-2 border-gray-200 w-56 p-2 h-28 hover:cursor-pointer' onClick={() => { handleTaskClick(task._id) }}>
        <Box className="flex flex-col ">
          <div className='flex justify-between'>
            <div>{checkStatus(task.status)}</div>
                
            <div className='text-sm'>
              <TodayIcon className='mb-0.5 text-red-600' /> 
                <span className='text-gray-500 font-medium'>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
            </div>
          </div>

          <div className='mt-2 text-gray-500 font-medium'>
            <p className=''>{firstLine}</p>
            <p className='mb-2'>{secondLine}</p>  {/* Display the second line truncated if necessary */}
          </div>
        </Box>
      </Box>
    </div>
  );
}
