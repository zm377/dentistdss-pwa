import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  List,
  Typography,
  Box,
} from '@mui/material';

/**
 * Common list styles for consistent appearance
 */
const commonListStyles = {
  '& .MuiListItem-root': {
    borderBottom: '1px solid',
    borderColor: 'divider',
    py: 1.5
  },
  '& .MuiListItem-root:last-child': {
    borderBottom: 'none'
  }
};

/**
 * ListCard - A reusable card component for displaying lists of items
 * 
 * Features:
 * - Consistent styling across all dashboard lists
 * - Empty state handling
 * - Custom list styling support
 * - Flexible item rendering through render prop
 */
const ListCard = ({
  items = [],
  renderItem,
  emptyMessage = "No items found.",
  title,
  listSx = {},
  cardSx = {},
  showDividers = true,
  dense = false,
  ...otherProps
}) => {
  const listStyles = showDividers ? { ...commonListStyles, ...listSx } : listSx;

  return (
    <Card sx={{ width: '100%', ...cardSx }} {...otherProps}>
      <CardContent>
        {title && (
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
        )}
        
        {items?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <List 
            sx={listStyles}
            dense={dense}
          >
            {items?.map((item, index) => renderItem(item, index))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

ListCard.propTypes = {
  /** Array of items to display */
  items: PropTypes.array,
  /** Function to render each item - receives (item, index) */
  renderItem: PropTypes.func.isRequired,
  /** Message to show when no items */
  emptyMessage: PropTypes.string,
  /** Optional title for the card */
  title: PropTypes.string,
  /** Custom styles for the list */
  listSx: PropTypes.object,
  /** Custom styles for the card */
  cardSx: PropTypes.object,
  /** Whether to show dividers between items */
  showDividers: PropTypes.bool,
  /** Whether to use dense list styling */
  dense: PropTypes.bool,
};

export default ListCard;
