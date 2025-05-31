import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

/**
 * Optimized Data Table Component
 * Memoized for performance with large datasets
 */
const DataTable = memo(({
  columns,
  data,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  pagination = true,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  dense = false,
  stickyHeader = false,
  maxHeight,
  ...props
}) => {
  // Memoize table rows for performance
  const tableRows = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((row, index) => (
      <TableRow key={row.id || index} hover>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align || 'left'}
            style={{ minWidth: column.minWidth }}
          >
            {column.render ? column.render(row[column.id], row, index) : row[column.id]}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [data, columns]);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper {...props}>
      <TableContainer sx={{ maxHeight }}>
        <Table
          stickyHeader={stickyHeader}
          size={dense ? 'small' : 'medium'}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: 'grey.50',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </TableContainer>
      
      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Paper>
  );
});

DataTable.displayName = 'DataTable';

DataTable.propTypes = {
  /** Table columns configuration */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      minWidth: PropTypes.number,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func,
    })
  ).isRequired,
  /** Table data */
  data: PropTypes.array,
  /** Loading state */
  loading: PropTypes.bool,
  /** Error message */
  error: PropTypes.string,
  /** Empty state message */
  emptyMessage: PropTypes.string,
  /** Enable pagination */
  pagination: PropTypes.bool,
  /** Current page */
  page: PropTypes.number,
  /** Rows per page */
  rowsPerPage: PropTypes.number,
  /** Total number of rows */
  totalRows: PropTypes.number,
  /** Page change handler */
  onPageChange: PropTypes.func,
  /** Rows per page change handler */
  onRowsPerPageChange: PropTypes.func,
  /** Rows per page options */
  rowsPerPageOptions: PropTypes.array,
  /** Dense table layout */
  dense: PropTypes.bool,
  /** Sticky header */
  stickyHeader: PropTypes.bool,
  /** Maximum height */
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DataTable;
