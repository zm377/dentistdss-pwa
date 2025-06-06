import React, {useState, useEffect} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom';

const GlobalSnackbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // Default severity

  // Define pages where GlobalSnackbar should be suppressed
  const suppressedPages = [
    '/login',
    '/signup',
    '/signup/clinic-staff',
    '/signup/clinic-admin'
  ];

  // Check if current page should suppress GlobalSnackbar
  const shouldSuppressSnackbar = suppressedPages.includes(location.pathname);

  useEffect(() => {
    const handleShowSnackbar = (event) => {
      // Suppress GlobalSnackbar on Login and Signup pages since they have inline error handling
      if (shouldSuppressSnackbar) {
        return;
      }

      setMessage(event.detail.message);
      setSeverity(event.detail.severity || 'info');
      setOpen(true);
    };

    window.addEventListener('show-snackbar', handleShowSnackbar);

    return () => {
      window.removeEventListener('show-snackbar', handleShowSnackbar);
    };
  }, [shouldSuppressSnackbar]);

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
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
          {typeof message === 'object' ? JSON.stringify(message) : message}
        </Alert>
      </Snackbar>
  );
};

export default GlobalSnackbar;