import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Box,
} from '@mui/material';

/**
 * ActionButton - A standardized button component for dashboard actions
 * 
 * Features:
 * - Consistent styling across dashboard
 * - Flexible positioning options
 * - Support for different button variants
 * - Proper spacing and alignment
 */
const ActionButton = ({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  position = 'right',
  sx = {},
  containerSx = {},
  fullWidth = false,
  ...otherProps
}) => {
  const getJustifyContent = () => {
    switch (position) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
      default:
        return 'flex-end';
    }
  };

  const buttonElement = (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      sx={sx}
      fullWidth={fullWidth}
      {...otherProps}
    >
      {children}
    </Button>
  );

  // If fullWidth, don't wrap in container
  if (fullWidth) {
    return buttonElement;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: getJustifyContent(),
        alignItems: 'center',
        mb: 3,
        ...containerSx,
      }}
    >
      {buttonElement}
    </Box>
  );
};

ActionButton.propTypes = {
  /** Button content */
  children: PropTypes.node.isRequired,
  /** Click handler */
  onClick: PropTypes.func,
  /** Button variant */
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  /** Button color */
  color: PropTypes.oneOf(['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning']),
  /** Button size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Button position in container */
  position: PropTypes.oneOf(['left', 'center', 'right']),
  /** Custom button styles */
  sx: PropTypes.object,
  /** Custom container styles */
  containerSx: PropTypes.object,
  /** Whether button should take full width */
  fullWidth: PropTypes.bool,
};

export default ActionButton;
