import { FormattedMessage } from 'react-intl';
import { ImportExport } from '@material-ui/icons';
import { Box, Button, Divider, FormControl, makeStyles, MenuItem, Popover, Select, Typography } from '@material-ui/core';
import { useContext, useState } from 'react';

import { GridSortModel } from '@mui/x-data-grid-pro';
import ShiftKeyIcon from './ShiftKeyIcon';
import { ViewDataTableContext } from './ViewDataTableContext';

const useStyles = makeStyles({
    formControl: {},
    popover: {
        borderRadius: 0,
        padding: 24,
    },
    shiftIcon: {
        margin: '0 5px -17px 5px',
    },
});

const ViewDataTableSorting: React.FunctionComponent = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const classes = useStyles();
    const { gridColumns, setSortModel, sortModel } = useContext(ViewDataTableContext);

    const handleClick = (event: React.SyntheticEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onChange = ({ name, value, field }: Record<string, string | undefined | unknown>) => {
        const newSortModel = sortModel.map(item => {
            return item.field === field ?
                { field: name === 'column' ? value : item.field, sort: name === 'direction' ? value : item.sort } : item;
        });
        setSortModel(newSortModel as GridSortModel);
    };

    return (
        <>
            <Button
                data-testid="ViewDataTableToolbar-showSorting"
                onClick={ handleClick }
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
                onClose={ handleClose }
                open={ open }
                transformOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="body1"><FormattedMessage id="misc.views.showSorting" /></Typography>
                    <Divider />
                    <Box display="flex" flexDirection="column">
                        { sortModel.map((item) => (
                            <Box key={ item.field } display="flex" flexDirection="row">
                                <FormControl className={ classes.formControl }>
                                    <Select
                                        name="column"
                                        onChange={ (evt) => onChange({ ...evt.target, field: item.field }) }
                                        value={ item.field }>
                                        { gridColumns.map(gridColumn => (
                                            <MenuItem key={ gridColumn.field } value={ gridColumn.field }>
                                                { gridColumn.headerName }
                                            </MenuItem>
                                        )) }
                                    </Select>
                                </FormControl>
                                <FormControl className={ classes.formControl }>
                                    <Select
                                        name="direction"
                                        onChange={ (evt) => onChange({ ...evt.target, field: item.field }) }
                                        value={ item.sort }>
                                        <MenuItem value="asc">Ascending</MenuItem>
                                        <MenuItem value="desc">Descending</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>)) }
                    </Box>

                    <p>Add column button</p>
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
