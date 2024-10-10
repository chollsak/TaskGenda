import { Button, TextField, Box } from '@mui/material';

const LoginForm = ({ onSubmit, width }) => (
  <Box
    component="form"
    width={width}
    onSubmit={onSubmit}
    className="flex flex-col items-center space-y-4 p-4 bg-white shadow-lg rounded-lg"
  >
    <TextField
      label="Email"
      type="email"
      name="email"
      variant="outlined"
      fullWidth
      required
      className="w-full"
      InputProps={{
        className: 'text-base',
      }}
    />
    <TextField
      label="Password"
      type="password"
      name="password"
      variant="outlined"
      fullWidth
      required
      className="w-full"
      InputProps={{
        className: 'text-base',
      }}
    />
    <Button
      type="submit"
      variant="contained"
      color="primary"
      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
    >
      Login
    </Button>
  </Box>
);

export default LoginForm;
