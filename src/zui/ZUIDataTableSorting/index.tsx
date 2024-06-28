import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { Add, Delete, ImportExport } from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Popover,
  Select,
  Typography,
} from '@mui/material';
import {
  GridColDef,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid-pro';

import { Msg } from 'core/i18n';
import ShiftKeyIcon from '../../features/views/components/ViewDataTable/ShiftKeyIcon';
import messageIds from 'zui/l10n/messageIds';

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

interface ZUIDataTableSortingProps {
  gridColumns: GridColDef[];
  onSortModelChange: (model: GridSortModel | []) => void;
  sortModel: GridSortModel | [];
}

const ZUIDataTableSorting: React.FunctionComponent<
  ZUIDataTableSortingProps
> = ({ gridColumns, onSortModelChange, sortModel }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const id = open ? 'sort-options' : undefined;

  const handleSortButtonClick = (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  const handleChange = (
    index: number,
    field?: string,
    direction?: GridSortDirection
  ) => {
    const newSortModel = sortModel.map((item, idx) => {
      return idx == index
        ? {
            field: field || item.field,
            sort: direction || item.sort,
          }
        : item;
    });

    onSortModelChange(newSortModel);
  };

  const handleDelete = (field: string) => {
    onSortModelChange(sortModel.filter((item) => item.field !== field));
  };

  const handleAdd = () => {
    const availableColumns = gridColumns.filter(
      (column) =>
        column.field !== 'id' &&
        !sortModel.map((s) => s.field).includes(column.field)
    );
    const newSortModel = sortModel?.length ? sortModel.map((item) => item) : [];
    newSortModel.push({ field: availableColumns[0].field, sort: 'asc' });
    onSortModelChange(newSortModel);
  };

  return (
    <>
      <Badge
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        badgeContent={sortModel.length}
        color="primary"
        overlap="circular"
      >
        <Button
          color="secondary"
          onClick={handleSortButtonClick}
          startIcon={<ImportExport />}
        >
          <Msg id={messageIds.dataTableSorting.button} />
        </Button>
      </Badge>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        classes={{ paper: classes.popover }}
        elevation={1}
        id={id}
        onClose={handlePopoverClose}
        open={open}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="body1">
            <Msg id={messageIds.dataTableSorting.title} />
          </Typography>
          <Divider />
          <Box display="flex" flexDirection="column" mt={1}>
            {sortModel.map((item, index) => (
              <Box key={item.field} display="flex" flexDirection="row" pb={1}>
                <Box flex={1} mr={2}>
                  <FormControl fullWidth variant="standard">
                    <Select
                      name="column"
                      onChange={(evt) =>
                        handleChange(index, evt.target.value as string)
                      }
                      value={item.field}
                      variant="standard"
                    >
                      {gridColumns.map((gridColumn) => (
                        <MenuItem
                          key={gridColumn.field}
                          disabled={sortModel
                            .map((s) => s.field)
                            .includes(gridColumn.field)}
                          value={gridColumn.field}
                        >
                          {gridColumn.headerName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl fullWidth variant="standard">
                    <Select
                      name="direction"
                      onChange={(evt) =>
                        handleChange(
                          index,
                          undefined,
                          evt.target.value as GridSortDirection
                        )
                      }
                      value={item.sort}
                      variant="standard"
                    >
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <IconButton
                  className={classes.deleteButton}
                  data-testid="deleteSortModelItem"
                  onClick={() => handleDelete(item.field)}
                  size="large"
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Box>
            <Button
              color="primary"
              disabled={sortModel.some((item) => !item.sort)}
              onClick={handleAdd}
              size="small"
              startIcon={<Add />}
              variant="text"
            >
              <Msg id={messageIds.dataTableSorting.addButton} />
            </Button>
          </Box>
          <Typography variant="caption">
            <Msg
              id={messageIds.dataTableSorting.hint}
              values={{
                shiftKeyIcon: (
                  <ShiftKeyIcon
                    size={40}
                    svgProps={{
                      className: classes.shiftIcon,
                    }}
                  />
                ),
              }}
            />
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default ZUIDataTableSorting;
