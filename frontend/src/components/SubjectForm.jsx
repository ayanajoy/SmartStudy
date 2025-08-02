import React, { useState } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import axios from 'axios';

const SubjectForm = ({ onAdd, onNotify }) => {
  const [subject, setSubject] = useState({ name: '', chapters: '', deadline: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/subjects', subject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAdd(res.data);
      setSubject({ name: '', chapters: '', deadline: '' });
      onNotify?.('✅ Subject added successfully!');
    } catch (err) {
      onNotify?.(err.response?.data?.message || 'Error adding subject', 'error');
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h6">Add Subject</Typography>
        <TextField
          label="Subject Name"
          value={subject.name}
          onChange={(e) => setSubject({ ...subject, name: e.target.value })}
          required
        />
        <TextField
          label="Total Chapters"
          type="number"
          value={subject.chapters}
          onChange={(e) => setSubject({ ...subject, chapters: e.target.value })}
          required
        />
        <TextField
  label="Deadline"
  type="date"
  InputLabelProps={{ shrink: true }}
  inputProps={{
    min: new Date().toISOString().split('T')[0], // prevent past dates
    pattern: '\\d{4}-\\d{2}-\\d{2}' // ensures valid YYYY-MM-DD format when typing
  }}
  value={subject.deadline}
  onChange={(e) => setSubject({ ...subject, deadline: e.target.value })}
  required
/>

        <Button variant="contained" type="submit">Add</Button>
      </Stack>
    </form>
  );
};

export default SubjectForm;
