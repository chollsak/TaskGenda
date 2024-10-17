import React from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import TodayIcon from '@mui/icons-material/Today';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Tooltip from '@mui/material/Tooltip';

export default function Card({ task }) {
  const router = useRouter();

  // Helper function to split the task name while keeping word boundaries
  const formatName = (name) => {
    if (!name) return ['No Task Name', ''];

    const splitAtSpace = (str, maxLength) => {
      if (str.length <= maxLength) return str;
      const indexOfLastSpace = str.lastIndexOf(' ', maxLength);
      return indexOfLastSpace !== -1 ? str.substring(0, indexOfLastSpace) : str.substring(0, maxLength);
    };

    const firstLine = splitAtSpace(name, 10);
    let secondLine = name.substring(firstLine.length).trim();

    secondLine = splitAtSpace(secondLine, 22);
    if (name.length > firstLine.length + secondLine.length) {
      secondLine = `${secondLine.substring(0, 22)}...`;
    }

    return [firstLine, secondLine];
  };

  const [firstLine, secondLine] = formatName(task?.name);

  const handleTaskClick = (taskId) => {
    router.push(`/task-detail/${taskId}`);
  };

  const checkStatus = (status) => {
    switch (status) {
      case 'in process':
        return (
          <Tooltip title='in process'>
            <PendingActionsIcon className='mb-0.5 text-yellow-500' />
          </Tooltip>
        );
      case 'success':
        return (
          <Tooltip title='success'>
            <AssignmentTurnedInIcon className='mb-0.5 text-green-600' />
          </Tooltip>
        );
    }
  };

  return (
    <div className='mx-1 my-3'>
      <Box
        className='rounded-lg border-2 border-gray-200 w-56 p-2 h-28 hover:cursor-pointer shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg 
        hover:border-yellow-500 hover:border-opacity-100 border-opacity-50'
        onClick={() => {
          handleTaskClick(task._id);
        }}
      >
        <Box className="flex flex-col">
          <div className='flex justify-between'>
            <div>{checkStatus(task.status)}</div>

            <div className='text-sm'>
              <TodayIcon className='mb-0.5 text-red-600' />
              <span className='text-gray-500 font-medium'>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </span>
            </div>
          </div>

          <div className='mt-2 text-gray-500 font-medium'>
            <p>{firstLine}</p>
            <p className='mb-2'>{secondLine}</p>
          </div>
        </Box>
      </Box>
    </div>
  );
}
