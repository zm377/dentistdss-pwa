import React, {useState, useEffect} from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  Toolbar,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const EnhancedDataGrid = ({
                            data = [],
                            columns = [],
                            title = '',
                            loading = false,
                            error = null,
                            onRowClick = null,
                            onEdit = null,
                            onDelete = null,
                            onAdd = null,
                            searchable = true,
                            sortable = true,
                            filterable = true,
                            selectable = false,
                            exportable = false,
                            density = 'standard', // 'compact', 'standard', 'comfortable'
                            pageSize = 10,
                          }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row =>
          columns.some(column => {
            const value = row[column.field];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
          })
      );
    }

    // Apply sorting
    if (orderBy) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (aValue < bValue) {
          return order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [data, searchTerm, orderBy, order, columns]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((row, index) => index);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleRowSelect = (index) => {
    const selectedIndex = selectedRows.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
          selectedRows.slice(0, selectedIndex),
          selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelected);
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const renderCellContent = (row, column) => {
    const value = row[column.field];

    if (column.renderCell) {
      return column.renderCell({row, value});
    }

    switch (column.type) {
      case 'avatar':
        return (
            <Avatar src={value} sx={{width: 32, height: 32}}>
              {!value && row.name?.charAt(0)}
            </Avatar>
        );
      case 'chip':
        return (
            <Chip
                label={value}
                color={column.getColor ? column.getColor(value) : 'default'}
                size="small"
            />
        );
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      case 'currency':
        return `$${value?.toFixed(2)}`;
      default:
        return value;
    }
  };

  const renderMobileCard = (row, index) => (
      <Card key={index} sx={{mb: 2}}>
        <CardContent>
          {columns.slice(0, 4).map((column) => (
              <Box key={column.field} sx={{mb: 1}}>
                <Typography variant="caption" color="text.secondary">
                  {column.headerName}
                </Typography>
                <Typography variant="body2">
                  {renderCellContent(row, column)}
                </Typography>
              </Box>
          ))}
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
            <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, row)}
            >
              <MoreVertIcon/>
            </IconButton>
          </Box>
        </CardContent>
      </Card>
  );

  const paginatedData = filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
  );

  if (error) {
    return (
        <Alert severity="error" sx={{m: 2}}>
          {error}
        </Alert>
    );
  }

  return (
      <Paper elevation={1} sx={{width: '100%'}}>
        {/* Toolbar */}
        <Toolbar sx={{pl: {sm: 2}, pr: {xs: 1, sm: 1}}}>
          <Typography variant="h6" component="div" sx={{flex: '1 1 100%'}}>
            {title}
          </Typography>

          {searchable && (
              <TextField
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon/>
                        </InputAdornment>
                    ),
                  }}
                  sx={{mr: 2, minWidth: 200}}
              />
          )}

          {filterable && (
              <Tooltip title="Filter list">
                <IconButton>
                  <FilterListIcon/>
                </IconButton>
              </Tooltip>
          )}

          {exportable && (
              <Tooltip title="Export data">
                <IconButton>
                  <GetAppIcon/>
                </IconButton>
              </Tooltip>
          )}

          {onAdd && (
              <Button
                  variant="contained"
                  startIcon={<AddIcon/>}
                  onClick={onAdd}
                  sx={{ml: 1}}
              >
                Add New
              </Button>
          )}
        </Toolbar>

        {loading ? (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
              <CircularProgress/>
            </Box>
        ) : isMobile ? (
            /* Mobile Card View */
            <Box sx={{p: 2}}>
              {paginatedData.map((row, index) => renderMobileCard(row, index))}
            </Box>
        ) : (
            /* Desktop Table View */
            <TableContainer>
              <Table size={density}>
                <TableHead>
                  <TableRow>
                    {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                              indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
                              checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                              onChange={handleSelectAllClick}
                          />
                        </TableCell>
                    )}
                    {columns.map((column) => (
                        <TableCell
                            key={column.field}
                            sortDirection={orderBy === column.field ? order : false}
                            sx={{fontWeight: 'bold'}}
                        >
                          {sortable && column.sortable !== false ? (
                              <TableSortLabel
                                  active={orderBy === column.field}
                                  direction={orderBy === column.field ? order : 'asc'}
                                  onClick={() => handleRequestSort(column.field)}
                              >
                                {column.headerName}
                              </TableSortLabel>
                          ) : (
                              column.headerName
                          )}
                        </TableCell>
                    ))}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row, index) => {
                    const isSelected = selectedRows.indexOf(index) !== -1;
                    return (
                        <TableRow
                            key={index}
                            hover
                            onClick={() => onRowClick && onRowClick(row)}
                            selected={isSelected}
                            sx={{cursor: onRowClick ? 'pointer' : 'default'}}
                        >
                          {selectable && (
                              <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isSelected}
                                    onChange={() => handleRowSelect(index)}
                                />
                              </TableCell>
                          )}
                          {columns.map((column) => (
                              <TableCell key={column.field}>
                                {renderCellContent(row, column)}
                              </TableCell>
                          ))}
                          <TableCell align="right">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuClick(e, row);
                                }}
                            >
                              <MoreVertIcon/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
        )}

        {/* Pagination */}
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
        />

        {/* Action Menu */}
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
          <MenuItem
              onClick={() => {
                onRowClick && onRowClick(selectedRow);
                handleMenuClose();
              }}
          >
            <VisibilityIcon sx={{mr: 1}}/>
            View
          </MenuItem>
          {onEdit && (
              <MenuItem
                  onClick={() => {
                    onEdit(selectedRow);
                    handleMenuClose();
                  }}
              >
                <EditIcon sx={{mr: 1}}/>
                Edit
              </MenuItem>
          )}
          {onDelete && (
              <MenuItem
                  onClick={() => {
                    onDelete(selectedRow);
                    handleMenuClose();
                  }}
              >
                <DeleteIcon sx={{mr: 1}}/>
                Delete
              </MenuItem>
          )}
        </Menu>
      </Paper>
  );
};

export default EnhancedDataGrid;
