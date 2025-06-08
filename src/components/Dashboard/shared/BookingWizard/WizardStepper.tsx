import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import type { WizardStepperProps } from './types';

/**
 * WizardStepper component
 * Displays the progress stepper
 */
export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  steps,
  isMobile,
}) => {
  return (
    <Box sx={{ px: 3, pt: 3, pb: 2 }}>
      <Stepper
        activeStep={currentStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        sx={{
          '& .MuiStepLabel-root': {
            fontSize: isMobile ? '0.875rem' : '1rem',
          }
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
