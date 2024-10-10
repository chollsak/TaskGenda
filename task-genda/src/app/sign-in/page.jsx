import React from 'react';
import LoginForm from '../components/LoginForm';
import { Typography } from '@mui/material';

export default function SignInPage() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-slate-200">
      <div className="w-full max-w-md">
        <Typography variant='h6' className='text-center mb-5'>Login</Typography>
        <LoginForm />
      </div>
    </main>
  );
}
