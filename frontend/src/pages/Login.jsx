import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('src/assets/login-bg.jpg')", // Make sure image exists in public/assets
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Fade in timeout={700}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 420,
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
          >
            Welcome Back 👋
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ color: '#f5f5f5' }}
            mb={3}
          >
            Login to your Smart Study Planner
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              InputProps={{ style: { backgroundColor: '#fff', borderRadius: 8 } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              InputProps={{ style: { backgroundColor: '#fff', borderRadius: 8 } }}
            />

            {error && (
              <Typography color="error" mt={1} fontSize="0.9rem">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: '#1a73e8',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: '#155ab6',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              LOGIN
            </Button>
          </form>

          <Typography
            mt={3}
            align="center"
            sx={{
              cursor: 'pointer',
              color: '#fff',
              textShadow: '0 1px 1px rgba(0,0,0,0.2)',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => navigate('/register')}
          >
            Don’t have an account? Register
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;
