import React, {useMemo, useState} from 'react';
import {
    Box,
    Chip,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Popover,
    Select,
    type SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {visuallyHidden} from '@mui/utils';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {format} from "date-fns";
import {type ActiveFiltersProps, type Column, type FilterPopoverProps, type Props} from './table.types.ts'

const useTable = <T extends Record<string, any>>(data: T[], columns: Column<T>[]) => {
    const [orderBy, setOrderBy] = useState<keyof T | ''>('');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRequestSort = (property: keyof T) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleFilterChange = (columnId: string, value: string) => {
        setFilters(prev => ({...prev, [columnId]: value}));
        setPage(0);
    };

    const handleFilterClear = (columnId: string) => {
        setFilters(prev => {
            const {[columnId]: _, ...rest} = prev;
            return rest;
        });
    };

    const filteredData = useMemo(() => {
        if (Object.keys(filters).length === 0) {
            return data;
        }

        return data.filter(row =>
            Object.entries(filters).every(([colId, value]) => {
                const col = columns.find(c => String(c.id) === colId);
                const cell = row[colId];

                if (!col || !cell) return false;

                if (col.inputType === 'DATE') {
                    const rowDate = format(new Date(cell), 'yyyy-MM-dd');
                    const filterDate = format(new Date(value), 'yyyy-MM-dd');
                    return rowDate === filterDate;
                } else if (col.inputType === 'OPTIONS') {
                    return cell.toString().toLowerCase() === value.toLowerCase();
                }

                return cell.toString().toLowerCase().includes(value.toLowerCase());
            })
        );
    }, [data, filters, columns]);

    const sortedData = useMemo(() => {
        if (!orderBy) {
            return filteredData;
        }

        return [...filteredData].sort((a: any, b: any) => {
            const col = columns.find(c => c.id === orderBy);
            if (col?.sortFn) {
                return order === 'asc' ? col.sortFn(a, b) : -col.sortFn(a, b);
            }
            const aValue = (a[orderBy] || '').toString();
            const bValue = (b[orderBy] || '').toString();
            return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
    }, [filteredData, orderBy, order, columns]);

    const paginatedData = useMemo(() => {
        return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    return {
        paginatedData,
        sortedData,
        filters,
        handleFilterChange,
        handleFilterClear,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        orderBy,
        order,
        handleRequestSort,
    };
};


const FilterPopover = <T extends Record<string, any>>({
                                                          anchorEl,
                                                          onClose,
                                                          currentColumn,
                                                          onApply,
                                                          tempSearch,
                                                          onTempSearchChange
                                                      }: FilterPopoverProps<T>) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onApply(tempSearch);
        }
    };

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        >
            <Box sx={{p: 2, width: {xs: '90vw', sm: '200px'}}}>
                <Stack spacing={1}>
                    {currentColumn?.inputType === 'OPTIONS' && currentColumn.options ? (
                        <Select size="small"
                                fullWidth
                                value={tempSearch || ''}
                                onChange={(e: SelectChangeEvent) => onApply(e.target.value)}
                                displayEmpty>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {currentColumn.options.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    ) : currentColumn?.inputType === 'DATE' ? (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker value={tempSearch ? new Date(tempSearch) : null}
                                        onChange={(newValue) => {
                                            if (newValue) {
                                                const formatted = format(new Date(newValue), 'yyyy-MM-dd');
                                                onApply(formatted, false); // autoClose = false
                                            }
                                        }}
                                        slotProps={{textField: {size: 'small', fullWidth: true}}}
                            />
                        </LocalizationProvider>
                    ) : (
                        <TextField autoFocus
                                   size="small"
                                   label={`Search ${String(currentColumn?.label || '')}`}
                                   variant="outlined"
                                   fullWidth
                                   value={tempSearch}
                                   onChange={e => onTempSearchChange(e.target.value)}
                                   onKeyDown={handleKeyDown}
                                   InputProps={{
                                       endAdornment: (
                                           <InputAdornment position="end">
                                               <IconButton onClick={() => onApply(tempSearch)}>
                                                   <SearchIcon fontSize="small"/>
                                               </IconButton>
                                           </InputAdornment>
                                       )
                                   }}
                        />
                    )}
                </Stack>
            </Box>
        </Popover>
    );
};

const ActiveFilters = <T extends Record<string, any>>({filters, columns, onClear}: ActiveFiltersProps<T>) => {
    if (Object.keys(filters).length === 0) return null;

    return (
        <Box sx={{px: 2, py: 1, borderBottom: '1px solid #dee2e6', backgroundColor: '#f8f9fa'}}>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} alignItems="flex-start" flexWrap="wrap"
                   useFlexGap sx={{rowGap: 1}}>
                <FilterAltIcon fontSize="small" color="primary"/>
                <Typography variant="body2" sx={{fontWeight: 600, color: '#495057'}}>
                    Active Filters:
                </Typography>
                {Object.entries(filters).map(([key, value]) => {
                    const col = columns.find(c => String(c.id) === key);
                    const label = col?.options?.find(opt => opt.value === value)?.label || value;
                    return (
                        <Chip key={key}
                              label={`${col?.label || key}: ${label}`}
                              onDelete={() => onClear(key)}
                              size="small"
                              sx={{fontSize: '0.75rem'}} />
                    );
                })}
            </Stack>
        </Box>
    );
};

const MuiTableHOC = <T extends Record<string, any>>({
                                                        columns,
                                                        componentInfos = [],
                                                        data,
                                                        rowsPerPageOptions = [10, 25, 50]
                                                    }: Props<T>) => {
    const {
        paginatedData,
        sortedData,
        filters,
        handleFilterChange,
        handleFilterClear,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        orderBy,
        order,
        handleRequestSort,
    } = useTable(data, columns);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchColumn, setSearchColumn] = useState<keyof T | ''>('');
    const [tempSearch, setTempSearch] = useState<string>('');

    const handleSearchClick = (event: React.MouseEvent<HTMLElement>, columnId: keyof T) => {
        setAnchorEl(event.currentTarget);
        setSearchColumn(columnId);
        setTempSearch(filters[columnId as string] || '');
    };

    const handleSearchApply = (value: string, autoClose = true) => {
        handleFilterChange(searchColumn as string, value);
        if (autoClose) setAnchorEl(null);
    };

    const currentColumn = columns.find(c => c.id === searchColumn);
    const isLoading = componentInfos.some(item => item.status === 'Loading');

    return (
        <Paper elevation={0} sx={{borderRadius: 2, border: '1px solid #dee2e6', overflow: 'hidden'}}>
            <ActiveFilters filters={filters} columns={columns} onClear={handleFilterClear}/>
            <Box sx={{width: '100%', overflowX: 'auto'}}>
                <TableContainer sx={{
                    minWidth: '100%',
                    maxWidth: '100vw',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    <Table size="small" stickyHeader sx={{backgroundColor: '#fff'}}>
                        <TableHead>
                            <TableRow>
                                {columns.map(column => (
                                    <TableCell key={String(column.id)}
                                               align={column.align || 'left'}
                                               sx={{
                                                   fontWeight: 600,
                                                   fontSize: {xs: '0.75rem', sm: '0.9rem'},
                                                   color: '#212529',
                                                   backgroundColor: '#f1f3f5',
                                                   borderBottom: '2px solid #ced4da',
                                                   padding: {xs: '6px 8px', sm: '8px 12px'},
                                                   whiteSpace: 'nowrap'
                                               }}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            {column.sortable ? (
                                                <TableSortLabel active={orderBy === column.id}
                                                                direction={orderBy === column.id ? order : 'asc'}
                                                                onClick={() => handleRequestSort(column.id)}>
                                                    {column.label}
                                                    {orderBy === column.id && (
                                                        <span style={visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </span>
                                                    )}
                                                </TableSortLabel>
                                            ) : column.label}
                                            {column.searchable && (
                                                <IconButton size="small"
                                                            onClick={(e) => handleSearchClick(e, column.id)}>
                                                    {
                                                        column.inputType === 'OPTIONS'
                                                            ?
                                                            <FilterAltIcon fontSize="inherit" sx={{fontSize: '16px'}}/>
                                                            : column.inputType === 'DATE'
                                                                ? <CalendarMonthIcon fontSize="inherit"
                                                                                     sx={{fontSize: '16px'}}/>
                                                                : <SearchIcon fontSize="inherit" sx={{fontSize: '16px'}}/>
                                                    }
                                                </IconButton>
                                            )}
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <img alt={'loader'} src={'/loaders/loader.svg'} width={48}/>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading && paginatedData.length > 0 ? (
                                paginatedData.map((row, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        sx={{
                                            '&:nth-of-type(odd)': {backgroundColor: '#f8f9fa'},
                                            '&:hover': {backgroundColor: '#e9ecef'},
                                        }}
                                    >
                                        {columns.map(col => (
                                            <TableCell key={String(col.id)}
                                                       align={col.align || 'left'}
                                                       sx={{
                                                           fontSize: {xs: '0.75rem', sm: '0.875rem'},
                                                           padding: {xs: '6px 8px', sm: '8px 12px'},
                                                           whiteSpace: 'nowrap'
                                                       }}
                                            >
                                                {col.render
                                                    ? col.render(row[col.id], row, rowIndex)
                                                    : col.inputType === 'DATE'
                                                        ? format(new Date(row[col.id]), 'dd/MM/yyyy')
                                                        : row[col.id]
                                                }
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center"
                                               sx={{padding: 4, color: '#6c757d'}}>
                                        No records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Typography variant="caption"
                        sx={{display: {xs: 'block', sm: 'none'}, px: 2, mt: 1, color: 'text.secondary'}}>
                Scroll horizontally to view all columns →
            </Typography>

            <TablePagination rowsPerPageOptions={rowsPerPageOptions}
                             component="div"
                             count={sortedData.length}
                             rowsPerPage={rowsPerPage}
                             page={page}
                             onPageChange={(_, newPage) => setPage(newPage)}
                             onRowsPerPageChange={e => {
                                 setRowsPerPage(parseInt(e.target.value, 10));
                                 setPage(0);
                             }} />

            <FilterPopover anchorEl={anchorEl}
                           onClose={() => setAnchorEl(null)}
                           currentColumn={currentColumn}
                           onApply={handleSearchApply}
                           tempSearch={tempSearch}
                           onTempSearchChange={setTempSearch}/>
        </Paper>
    );
}

export default MuiTableHOC;