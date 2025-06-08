import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  List,
  Typography,
  Box,
  SxProps,
  Theme,
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

interface ListCardProps {
  /** Array of items to display */
  items?: any[];
  /** Function to render each item - receives (item, index) */
  renderItem: (item: any, index: number) => ReactNode;
  /** Message to show when no items */
  emptyMessage?: string;
  /** Optional title for the card */
  title?: string;
  /** Custom styles for the list */
  listSx?: SxProps<Theme>;
  /** Custom styles for the card */
  cardSx?: SxProps<Theme>;
  /** Whether to show dividers between items */
  showDividers?: boolean;
  /** Whether to use dense list styling */
  dense?: boolean;
  /** Additional props passed to Card component */
  [key: string]: any;
}

/**
 * ListCard - A reusable card component for displaying lists of items
 *
 * Features:
 * - Consistent styling across all dashboard lists
 * - Empty state handling
 * - Custom list styling support
 * - Flexible item rendering through render prop
 */
const ListCard: React.FC<ListCardProps> = ({
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

export default ListCard;
