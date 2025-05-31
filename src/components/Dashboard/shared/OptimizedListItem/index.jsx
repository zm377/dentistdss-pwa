import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemSecondaryAction,
  Box,
  Chip,
} from '@mui/material';

/**
 * Optimized List Item Component
 * Memoized for performance with complex lists
 */
const OptimizedListItem = memo(({
  primary,
  secondary,
  action,
  status,
  statusColor = 'default',
  onClick,
  dense = false,
  divider = false,
  ...props
}) => {
  return (
    <ListItem
      button={!!onClick}
      onClick={onClick}
      dense={dense}
      divider={divider}
      {...props}
    >
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: secondary || status ? 1 : 0 }}>
          {primary}
        </Box>
        {(secondary || status) && (
          <Box>
            {secondary && (
              <Box sx={{ mb: status ? 0.5 : 0, color: 'text.secondary', fontSize: '0.875rem' }}>
                {secondary}
              </Box>
            )}
            {status && (
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={status}
                  color={statusColor}
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
      {action && (
        <ListItemSecondaryAction>
          {action}
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
});

OptimizedListItem.displayName = 'OptimizedListItem';

OptimizedListItem.propTypes = {
  /** Primary text content */
  primary: PropTypes.node.isRequired,
  /** Secondary text content */
  secondary: PropTypes.node,
  /** Action component (button, etc.) */
  action: PropTypes.node,
  /** Status text for chip */
  status: PropTypes.string,
  /** Status chip color */
  statusColor: PropTypes.oneOf(['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning']),
  /** Click handler */
  onClick: PropTypes.func,
  /** Dense layout */
  dense: PropTypes.bool,
  /** Show divider */
  divider: PropTypes.bool,
};

export default OptimizedListItem;
