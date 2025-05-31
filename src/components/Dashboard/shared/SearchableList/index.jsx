import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ListCard from '../ListCard';
import { filterItems } from '../../../../utils/dashboard/dashboardUtils';

/**
 * SearchableList - A combination of search input and list display
 * 
 * Features:
 * - Built-in search functionality
 * - Configurable search fields
 * - Debounced search for performance
 * - All ListCard features included
 */
const SearchableList = ({
  items = [],
  renderItem,
  searchFields = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  emptySearchMessage = "No items match your search.",
  showSearch = true,
  searchValue: controlledSearchValue,
  onSearchChange: controlledOnSearchChange,
  ...listCardProps
}) => {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  
  // Use controlled or internal search value
  const searchValue = controlledSearchValue !== undefined ? controlledSearchValue : internalSearchValue;
  const onSearchChange = controlledOnSearchChange || setInternalSearchValue;

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchValue.trim()) return items;
    return filterItems(items, searchValue, searchFields);
  }, [items, searchValue, searchFields]);

  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);
  };

  // Determine empty message based on search state
  const currentEmptyMessage = searchValue.trim() ? emptySearchMessage : emptyMessage;

  return (
    <Box>
      {showSearch && (
        <TextField
          fullWidth
          placeholder={searchPlaceholder}
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      
      <ListCard
        items={filteredItems}
        renderItem={renderItem}
        emptyMessage={currentEmptyMessage}
        {...listCardProps}
      />
    </Box>
  );
};

SearchableList.propTypes = {
  /** Array of items to display and search */
  items: PropTypes.array,
  /** Function to render each item - receives (item, index) */
  renderItem: PropTypes.func.isRequired,
  /** Fields to search in (dot notation supported) */
  searchFields: PropTypes.arrayOf(PropTypes.string),
  /** Placeholder text for search input */
  searchPlaceholder: PropTypes.string,
  /** Message when no items exist */
  emptyMessage: PropTypes.string,
  /** Message when search returns no results */
  emptySearchMessage: PropTypes.string,
  /** Whether to show search input */
  showSearch: PropTypes.bool,
  /** Controlled search value */
  searchValue: PropTypes.string,
  /** Controlled search change handler */
  onSearchChange: PropTypes.func,
  // All other props are passed to ListCard
};

export default SearchableList;
