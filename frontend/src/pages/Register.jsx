import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration error');
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('src/assets/login-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
            sx={{ fontWeight: 'bold', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
          >
            Create Account ✨
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: '#f5f5f5' }}
            mb={3}
          >
            Register to start planning your study sessions
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={handleChange}
              InputProps={{ style: { backgroundColor: '#fff', borderRadius: 8 } }}
            />
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
                backgroundColor: '#7b1fa2',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: '#6a1b9a',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Register
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
            onClick={() => navigate('/')}
          >
            Already have an account? Login
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Register;
