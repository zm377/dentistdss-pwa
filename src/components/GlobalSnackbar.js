import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const GlobalSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // Default severity

  useEffect(() => {
    const handleShowSnackbar = (event) => {
      setMessage(event.detail.message);
      setSeverity(event.detail.severity || 'info');
      setOpen(true);
    };

    window.addEventListener('show-snackbar', handleShowSnackbar);

    return () => {
      window.removeEventListener('show-snackbar', handleShowSnackbar);
    };
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {typeof message === 'object' ? JSON.stringify(message) : message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar; 