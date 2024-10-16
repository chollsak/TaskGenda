import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingComponent = () => {
  return (
    <div className="flex justify-center items-start h-screen mt-20">
      <CircularProgress  className='text-[#00fca8]' size={60} />
    </div>
  );
};

export default LoadingComponent;
