import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField
} from '@mui/material';
import axios from 'axios';

const Planner = () => {
  const [events, setEvents] = useState([]);

  // 💡 User study preferences
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(2);
  const [startTime, setStartTime] = useState('10:00');

  // 🔁 Fetch study events
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Error loading events', err);
    }
  };

  // ➕ Add event manually on calendar click
  const addEvent = async (info) => {
    const title = prompt('Enter Task Title:');
    if (!title) return;

    const token = localStorage.getItem('token');
    const res = await axios.post(
      'http://localhost:5000/api/events',
      {
        title,
        start: info.dateStr,
        end: info.dateStr,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEvents([...events, res.data]);
  };

  // 🗑️ Delete event
  const deleteEvent = async (eventInfo) => {
    if (window.confirm(`Delete "${eventInfo.event.title}"?`)) {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/events/${eventInfo.event.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    }
  };

  // 📚 Auto-plan from SubjectList with user time preferences (Custom logic)
  const generateStudyPlanFromSubjects = async () => {
    const token = localStorage.getItem('token');
    const subjectRes = await axios.get('http://localhost:5000/api/subjects', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const subjects = subjectRes.data;

    let plan = [];
    let currentDate = new Date();
    const [hour, minute] = startTime.split(':').map(Number);
    currentDate.setHours(hour, minute, 0, 0);

    let hoursLeft = studyHoursPerDay;

    for (let subj of subjects) {
      for (let i = 1; i <= subj.chapters; i++) {
        if (hoursLeft <= 0) {
          currentDate.setDate(currentDate.getDate() + 1);
          currentDate.setHours(hour, minute);
          hoursLeft = studyHoursPerDay;
        }

        let start = new Date(currentDate);
        let end = new Date(start);
        end.setHours(start.getHours() + 1);

        plan.push({
          title: `${subj.name} - Chapter ${i}`,
          start,
          end,
        });

        currentDate = new Date(end);
        hoursLeft--;
      }
    }

    for (let session of plan) {
      await axios.post('http://localhost:5000/api/events', session, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>📅 Weekly Study Planner</Typography>

      {/* 💬 User Time Preferences */}
      <Box
        component="form"
        sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}
        onSubmit={(e) => e.preventDefault()}
      >
        <TextField
          label="Daily Study Hours"
          type="number"
          value={studyHoursPerDay}
          onChange={(e) => setStudyHoursPerDay(Number(e.target.value))}
          inputProps={{ min: 1, max: 8 }}
        />

        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="outlined" onClick={generateStudyPlanFromSubjects}>
          📚 Generate Plan from Subjects
        </Button>
      </Box>

      {/* 📅 FullCalendar */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay',
        }}
        events={events}
        dateClick={addEvent}
        eventClick={deleteEvent}
        height="auto"
      />
    </Container>
  );
};

export default Planner;
