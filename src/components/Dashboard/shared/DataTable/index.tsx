import React, { memo, useMemo } from 'react';
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
  useTheme,
  useMediaQuery,
  PaperProps,
} from '@mui/material';
import { TOUCH_TARGETS } from '../../../../utils/mobileOptimization';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

interface DataTableProps extends Omit<PaperProps, 'children'> {
  /** Table columns configuration */
  columns: Column[];
  /** Table data */
  data?: any[];
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Empty state message */
  emptyMessage?: string;
  /** Enable pagination */
  pagination?: boolean;
  /** Current page */
  page?: number;
  /** Rows per page */
  rowsPerPage?: number;
  /** Total number of rows */
  totalRows?: number;
  /** Page change handler */
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  /** Rows per page change handler */
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Rows per page options */
  rowsPerPageOptions?: number[];
  /** Dense table layout */
  dense?: boolean;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Maximum height */
  maxHeight?: string | number;
}

/**
 * Optimized Data Table Component
 * Memoized for performance with large datasets
 */
const DataTable: React.FC<DataTableProps> = memo(({
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Memoize table rows for performance
  const tableRows = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((row, index) => (
      <TableRow
        key={row.id || index}
        hover
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          }
        }}
      >
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align || 'left'}
            style={{ minWidth: column.minWidth }}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1, sm: 2 },
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            {column.render ? column.render(row[column.id], row, index) : row[column.id]}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [data, columns, theme]);

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
    <Paper
      {...props}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        ...props.sx
      }}
    >
      <TableContainer
        sx={{
          maxHeight,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.grey[100],
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[400],
            borderRadius: 4,
          },
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          size={isMobile ? 'small' : (dense ? 'small' : 'medium')}
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
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 1, sm: 2 },
                    whiteSpace: 'nowrap'
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
          rowsPerPageOptions={isMobile ? [5, 10] : rowsPerPageOptions}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange || (() => {})}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{
            '& .MuiTablePagination-toolbar': {
              minHeight: TOUCH_TARGETS.MINIMUM,
              px: { xs: 1, sm: 2 }
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '& .MuiIconButton-root': {
              minWidth: TOUCH_TARGETS.MINIMUM,
              minHeight: TOUCH_TARGETS.MINIMUM
            }
          }}
        />
      )}
    </Paper>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
export type { DataTableProps, Column };
