import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage:
          'url("https://images.unsplash.com/photo-1584697964192-ec7d2b3c0944?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Welcome Card */}
      <Card
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mb: 4,
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(12px)',
          boxShadow: 10,
          borderRadius: 5,
          color: 'white',
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" fontWeight="bold">
            👋 Welcome, {user?.name || 'Student'}!
          </Typography>
          <Typography align="center" mt={1} sx={{ opacity: 0.9 }}>
            Email: {user?.email || 'example@student.com'}
          </Typography>
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{
                borderRadius: 3,
                px: 5,
                fontWeight: 'bold',
              }}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={3} justifyContent="center">
        {[
          { label: '📘 Subjects', value: 7, bg: '#4dabf5' },
          { label: '✅ Tasks Done', value: 15, bg: '#66bb6a' },
          { label: '📅 Sessions', value: 4, bg: '#ffa726' },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 4,
                textAlign: 'center',
                backgroundColor: stat.bg,
                color: 'white',
              }}
            >
              <Typography variant="h6" fontWeight="medium">
                {stat.label}
              </Typography>
              <Typography variant="h4" fontWeight="bold" mt={1}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box
        mt={5}
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={3}
      >
        <Button
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'white',
            px: 4,
            borderRadius: 4,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          ➕ Add Subject
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'white',
            px: 4,
            borderRadius: 4,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          ⏱️ Start Pomodoro
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'white',
            px: 4,
            borderRadius: 4,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          📆 Weekly Planner
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
