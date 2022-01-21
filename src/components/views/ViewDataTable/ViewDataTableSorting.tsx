import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/styles';
import { Add, Delete, ImportExport } from '@material-ui/icons';
import { Box, Button, Divider, FormControl, IconButton, MenuItem, Popover, Select, Typography } from '@material-ui/core';
import { useContext, useState } from 'react';

import { GridSortModel } from '@mui/x-data-grid-pro';
import ShiftKeyIcon from './ShiftKeyIcon';
import { ViewDataTableContext } from './ViewDataTableContext';

const useStyles = makeStyles({
    deleteButton: {
        padding: 6,
    },
    popover: {
        borderRadius: 0,
        minWidth: 450,
        padding: 24,
    },
    shiftIcon: {
        margin: '0 5px -17px 5px',
    },
    sortModelItem: {
        padding: '0 0 8px 0',
    },
});

const ViewDataTableSorting: React.FunctionComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const classes = useStyles();
    const { gridColumns, setSortModel, sortModel } = useContext(ViewDataTableContext);
    const open = Boolean(anchorEl);
    const id = open ? 'sort-options' : undefined;

    const handleSortButtonClick = (event: React.SyntheticEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const handleChange = ({ name, value, field }: Record<string, string | undefined | unknown>) => {
        const newSortModel = sortModel.map(item => {
            if (name === 'delete' && item.field === field) return null;
            else return item.field === field ?
                { field: name === 'column' ? value : item.field, sort: name === 'direction' ? value : item.sort } : item;
        }).filter(item => !!item);

        setSortModel(newSortModel as GridSortModel);
    };

    const handleAdd = () => {
        const availableColumns = gridColumns
            .filter(column => column.field !== 'id' && !sortModel.map(s => s.field).includes(column.field));
        const newSortModel = sortModel?.length ? sortModel.map(item => item) : [];
        newSortModel.push({ field: availableColumns[0].field, sort: 'asc' });
        setSortModel(newSortModel);
    };

    return (
        <>
            <Button
                data-testid="ViewDataTableToolbar-showSorting"
                onClick={ handleSortButtonClick }
                startIcon={ <ImportExport /> }>
                <FormattedMessage id="misc.views.showSorting" />
            </Button>
            <Popover
                anchorEl={ anchorEl }
                anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'bottom',
                }}
                classes={{ paper: classes.popover }}
                elevation={ 1 }
                id={ id }
                onClose={ handlePopoverClose }
                open={ open }
                transformOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="body1"><FormattedMessage id="misc.views.showSorting" /></Typography>
                    <Divider />
                    <Box display="flex" flexDirection="column" mt={ 1 }>
                        { sortModel.map((item) => (
                            <Box key={ item.field } display="flex" flexDirection="row" pb={ 1 }>
                                <Box flex={ 1 } mr={ 2 }>
                                    <FormControl fullWidth>
                                        <Select
                                            name="column"
                                            onChange={ (evt) => handleChange({ ...evt.target, field: item.field }) }
                                            value={ item.field }>
                                            { gridColumns.map(gridColumn => (
                                                <MenuItem key={ gridColumn.field }
                                                    disabled={ sortModel.map(s => s.field).includes(gridColumn.field) }
                                                    value={ gridColumn.field }>
                                                    { gridColumn.headerName }
                                                </MenuItem>
                                            )) }
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box flex={ 1 }>
                                    <FormControl fullWidth>
                                        <Select
                                            name="direction"
                                            onChange={ (evt) => handleChange({ ...evt.target, field: item.field }) }
                                            value={ item.sort }>
                                            <MenuItem value="asc">Ascending</MenuItem>
                                            <MenuItem value="desc">Descending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <IconButton
                                    className={ classes.deleteButton }
                                    onClick={ () => handleChange({ field: item.field, name: 'delete', value: true }) }>
                                    <Delete />
                                </IconButton>
                            </Box>)) }
                    </Box>
                    <Box>
                        <Button color="primary"
                            disabled={ sortModel.some(item => !item.sort) }
                            onClick={ handleAdd }
                            size="small"
                            startIcon={ <Add /> }
                            variant="text">
                            Add sorting column
                        </Button>
                    </Box>
                    <Typography variant="caption">
                        <span>Hint: hold down</span>
                        <ShiftKeyIcon size={ 40 } svgProps={{ className: classes.shiftIcon }} />
                        <span>while clicking multiple columns</span>
                    </Typography>
                </Box>
            </Popover>
        </>
    );
};

export default ViewDataTableSorting;
