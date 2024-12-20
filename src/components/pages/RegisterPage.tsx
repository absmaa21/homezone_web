import {TextField, Button, Box, Typography} from '@mui/material';
import React, {useEffect, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";

const RegisterPage = ({onSuccess}: {onSuccess?: () => void}) => {
  const User = useAuth()

  const [errors, setErrors] = useState({username: '', email: '', password: '', conPassword: ''})

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)

    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const conPassword = formData.get('conPassword') as string

    if (password !== conPassword) {
      setErrors(p => ({...p, conPassword: 'Passwords do not match!'}))
      return
    }

    if (password.length < 8) {
      setErrors(p => ({...p, password: 'Password length must be 8 or greater!'}))
      return
    }

    User.register(username, email, password).then(err => {
      if (err) {
        if (err.toLowerCase().includes("email")) setErrors(p => ({...p, email: err}))
        else setErrors({username: ' ', email: ' ', password: ' ', conPassword: err})
      }
      else if (onSuccess) onSuccess()
    })
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrors({username: '', email: '', password: '', conPassword: ''})
    }, 3000)
    return () => clearTimeout(timeout)
  }, [errors]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          name="username"
          required
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          name="email"
          required
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          name="password"
          required
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          type="password"
          name="conPassword"
          required
          error={!!errors.conPassword}
          helperText={errors.conPassword}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegisterPage;
