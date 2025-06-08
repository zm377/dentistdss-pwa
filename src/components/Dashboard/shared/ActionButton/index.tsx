import React, { ReactNode } from 'react';
import {
  Button,
  Box,
  ButtonProps,
  SxProps,
  Theme,
} from '@mui/material';

type ButtonVariant = 'text' | 'outlined' | 'contained';
type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonPosition = 'left' | 'center' | 'right';

interface ActionButtonProps extends Omit<ButtonProps, 'variant' | 'color' | 'size'> {
  /** Button content */
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button color */
  color?: ButtonColor;
  /** Button size */
  size?: ButtonSize;
  /** Button position in container */
  position?: ButtonPosition;
  /** Custom button styles */
  sx?: SxProps<Theme>;
  /** Custom container styles */
  containerSx?: SxProps<Theme>;
  /** Whether button should take full width */
  fullWidth?: boolean;
}

/**
 * ActionButton - A standardized button component for dashboard actions
 *
 * Features:
 * - Consistent styling across dashboard
 * - Flexible positioning options
 * - Support for different button variants
 * - Proper spacing and alignment
 */
const ActionButton: React.FC<ActionButtonProps> = ({
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
  const getJustifyContent = (): string => {
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

export default ActionButton;
