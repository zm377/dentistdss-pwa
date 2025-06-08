/**
 * BookingWizard utility functions
 * Extracted to follow Single Responsibility Principle
 */

/**
 * Get wizard steps based on login status
 */
export const getWizardSteps = (isLoggedIn: boolean): string[] => [
  'Select Clinic',
  'Choose Date & Time',
  'Service Details',
  ...(isLoggedIn ? [] : ['Patient Information']),
  'Confirmation'
];

/**
 * Adjust step index based on login status
 * When logged in, skip the patient information step
 */
export const adjustStepIndex = (step: number, isLoggedIn: boolean): number => {
  return isLoggedIn && step >= 3 ? step + 1 : step;
};

/**
 * Check if current step is the last step
 */
export const isLastStep = (currentStep: number, totalSteps: number): boolean => {
  return currentStep === totalSteps - 1;
};

/**
 * Check if current step is the first step
 */
export const isFirstStep = (currentStep: number): boolean => {
  return currentStep === 0;
};

/**
 * Get button text based on step and loading state
 */
export const getNextButtonText = (isLast: boolean, loading: boolean): string => {
  if (loading) return 'Processing...';
  return isLast ? 'Book Appointment' : 'Next';
};
