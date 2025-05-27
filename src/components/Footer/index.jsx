import React from 'react';
import { Box, Typography } from '@mui/material';
import config from '../../config';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        textAlign: 'center',
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: 'inherit',
          color: 'text.secondary',
          '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }
        }}
      >
        © {new Date().getFullYear()} {config.app.name} by Zhifei Mi - All rights reserved.
        Contact us at: <a href="mailto:dentistdss@gmail.com">dentistdss@gmail.com</a>
      </Typography>
    </Box>
  );
};

export default Footer;
