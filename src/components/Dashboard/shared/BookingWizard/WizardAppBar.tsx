import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';
import { getNextButtonText } from './utils';
import type { WizardAppBarProps } from './types';

/**
 * WizardAppBar component
 * Handles the app bar with navigation controls
 */
export const WizardAppBar: React.FC<WizardAppBarProps> = ({
  onClose,
  onPreviousStep,
  onNext,
  isFirstStep,
  isLastStep,
  loading,
}) => {
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        position: 'relative',
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ mr: 2 }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flex: 1 }}>
          Book New Appointment
        </Typography>
        
        {!isFirstStep && (
          <Button
            color="inherit"
            onClick={onPreviousStep}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
            Go Back 
          </Button>
        )}
        
        <Button
          color="inherit"
          onClick={onNext}
          disabled={loading}
          variant="outlined"
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          {getNextButtonText(isLastStep, loading)}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
