import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import { calculatePasswordStrength, getPasswordStrengthColor } from '../utils/passwordStrength';

const PasswordStrengthIndicator = ({ password, theme }) => {
  const { score, level, feedback } = calculatePasswordStrength(password);
  
  if (!password) return null;
  
  const color = getPasswordStrengthColor(level, theme);
  const progressValue = (score / 6) * 100;
  
  return (
    <Box sx={{ mt: 1, mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          Password strength:
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color, 
            fontWeight: 600,
            textTransform: 'capitalize'
          }}
        >
          {level}
        </Typography>
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={progressValue} 
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 200],
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 3,
          }
        }}
      />
      
      {feedback.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {feedback.map((tip, index) => (
            <Chip
              key={index}
              label={tip}
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: '0.7rem',
                height: 20,
                borderColor: theme.palette.grey[theme.palette.mode === 'dark' ? 700 : 300],
                color: theme.palette.text.secondary
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PasswordStrengthIndicator; 