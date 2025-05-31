import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const DefaultTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Dialog type configurations
const dialogTypeConfig = {
  success: {
    icon: SuccessIcon,
    color: 'success.main',
    backgroundColor: 'success.light',
    iconColor: 'success.contrastText',
  },
  error: {
    icon: ErrorIcon,
    color: 'error.main',
    backgroundColor: 'error.light',
    iconColor: 'error.contrastText',
  },
  warning: {
    icon: WarningIcon,
    color: 'warning.main',
    backgroundColor: 'warning.light',
    iconColor: 'warning.contrastText',
  },
  info: {
    icon: InfoIcon,
    color: 'info.main',
    backgroundColor: 'info.light',
    iconColor: 'info.contrastText',
  },
};

/**
 * Enhanced ConfirmationDialog - A reusable dialog for user notifications
 *
 * Features:
 * - Support for different dialog types (success, error, warning, info)
 * - Dynamic titles and messages
 * - Appropriate icons and colors for each type
 * - Consistent Material-UI styling
 * - Proper accessibility attributes
 */
const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  TransitionComponent = DefaultTransition,
  hideBackdropClick = true,
  disableEscapeKeyDown = true,
  showIcon = true,
  maxWidth = 'sm',
  ...otherProps
}) => {
  const theme = useTheme();
  const config = dialogTypeConfig[type] || dialogTypeConfig.info;
  const IconComponent = config.icon;

  const handleDialogClose = (_, reason) => {
    if (hideBackdropClick && reason === 'backdropClick') {
      return;
    }
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') {
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={TransitionComponent}
      keepMounted
      onClose={handleDialogClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      disableEscapeKeyDown={disableEscapeKeyDown}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
            boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
          }
        }
      }}
      {...otherProps}
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          fontWeight: 'medium',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 1
        }}
      >
        {showIcon && (
          <Avatar
            sx={{
              bgcolor: config.backgroundColor,
              color: config.iconColor,
              width: 40,
              height: 40,
            }}
          >
            <IconComponent />
          </Avatar>
        )}
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          id="confirmation-dialog-description"
          sx={{
            fontSize: '1rem',
            color: 'text.primary',
            mt: showIcon ? 1 : 0
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        {showCancel && (
          <Button
            onClick={onClose}
            color="inherit"
            sx={{ minWidth: 100 }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={onConfirm || onClose}
          color={type === 'error' ? 'error' : 'primary'}
          variant="contained"
          autoFocus
          sx={{ minWidth: 100 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  /** Whether the dialog is open */
  open: PropTypes.bool.isRequired,
  /** Function to close the dialog */
  onClose: PropTypes.func.isRequired,
  /** Function to handle confirm action */
  onConfirm: PropTypes.func,
  /** Dialog title */
  title: PropTypes.string.isRequired,
  /** Dialog message content */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  /** Dialog type for styling and icon */
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  /** Text for the confirm button */
  confirmText: PropTypes.string,
  /** Text for the cancel button */
  cancelText: PropTypes.string,
  /** Whether to show cancel button */
  showCancel: PropTypes.bool,
  /** Custom transition component */
  TransitionComponent: PropTypes.elementType,
  /** Whether to prevent closing on backdrop click */
  hideBackdropClick: PropTypes.bool,
  /** Whether to prevent closing on escape key */
  disableEscapeKeyDown: PropTypes.bool,
  /** Whether to show the type icon */
  showIcon: PropTypes.bool,
  /** Maximum width of the dialog */
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

export default ConfirmationDialog;