// Password strength utility functions

export const calculatePasswordStrength = (password) => {
  if (!password) return {score: 0, level: 'none', feedback: []};

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Lowercase letters
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  // Uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  // Numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  // Special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }

  // Determine strength level
  let level = 'weak';
  if (score >= 5) {
    level = 'strong';
  } else if (score >= 3) {
    level = 'medium';
  }

  return {score, level, feedback};
};

export const getPasswordStrengthColor = (level, theme) => {
  switch (level) {
    case 'strong':
      return theme.palette.success.main;
    case 'medium':
      return theme.palette.warning.main;
    case 'weak':
      return theme.palette.error.main;
    default:
      return theme.palette.grey[400];
  }
};

export const isPasswordStrong = (password) => {
  const {level} = calculatePasswordStrength(password);
  return level === 'strong';
}; 