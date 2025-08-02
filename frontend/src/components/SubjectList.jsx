import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const SubjectList = ({ refresh }) => {
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedSubject, setEditedSubject] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/subjects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch subjects', severity: 'error' });
    }
  };

  const deleteSubject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: '✅ Subject deleted successfully', severity: 'success' });
      fetchSubjects();
      refresh();
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Failed to delete subject', severity: 'error' });
    }
  };

  const startEdit = (subject) => {
    setEditingId(subject._id);
    setEditedSubject({ ...subject });
  };

  const saveEdit = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/subjects/${editingId}`, editedSubject, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setEditingId(null);
    setSnackbar({ open: true, message: '✅ Subject updated successfully', severity: 'success' });

    await fetchSubjects(); // wait for updated data
    if (refresh) refresh();
  } catch (err) {
    console.error('Update Error:', err); // 👈 helpful for debugging
    setSnackbar({ open: true, message: '❌ Failed to update subject', severity: 'error' });
  }
};


  useEffect(() => {
    fetchSubjects();
  }, [refresh]);

  return (
    <>
      <Stack spacing={2} mt={4}>
        <Typography variant="h6">Your Subjects</Typography>

        {subjects.map((subj) => (
          <Card key={subj._id} variant="outlined">
            <CardContent>
              {editingId === subj._id ? (
                <>
                  <TextField
                    label="Name"
                    value={editedSubject.name}
                    onChange={(e) => setEditedSubject({ ...editedSubject, name: e.target.value })}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Chapters"
                    type="number"
                    value={editedSubject.chapters}
                    onChange={(e) =>
                      setEditedSubject({ ...editedSubject, chapters: Number(e.target.value) })
                    }
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Deadline"
                    type="date"
                    value={editedSubject.deadline?.slice(0, 10)}
                    onChange={(e) => setEditedSubject({ ...editedSubject, deadline: e.target.value })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                  <Button onClick={saveEdit} variant="contained" color="primary" sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button onClick={() => setEditingId(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Typography variant="h6">{subj.name}</Typography>
                  <Typography>Chapters: {subj.chapters}</Typography>
                  <Typography>
                    Deadline:{' '}
                    {new Date(subj.deadline).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })}
                  </Typography>
                  <Button onClick={() => startEdit(subj)} sx={{ mt: 1 }} color="primary">
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => deleteSubject(subj._id)}
                    sx={{ mt: 1, ml: 1 }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default SubjectList;
