import React, { useState } from 'react';
import { Container, Divider, Snackbar, Alert } from '@mui/material';
import SubjectForm from '../components/SubjectForm';
import SubjectList from '../components/SubjectList';

const Subjects = () => {
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const refreshList = () => setTriggerRefresh(!triggerRefresh);

  const showSnackbar = (message, severity = 'success') => {
    setSnack({ open: true, message, severity });
  };

  return (
    <Container maxWidth="sm">
      <SubjectForm onAdd={refreshList} onNotify={showSnackbar} />
      <Divider sx={{ my: 4 }} />
      <SubjectList refresh={triggerRefresh} onNotify={showSnackbar} />

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Subjects;
