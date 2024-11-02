import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen">
    <img src="/img/loader.gif" alt="Loading" className="w-40" />
  </div>
  );
};

export default LoadingComponent;
