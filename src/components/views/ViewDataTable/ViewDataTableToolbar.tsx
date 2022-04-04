import { GridToolbarFilterButton } from '@mui/x-data-grid-pro';
import { useContext } from 'react';
import { Add, Launch, RemoveCircleOutline } from '@material-ui/icons';
import { Box, Button, Slide, Tooltip } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import { ConfirmDialogContext } from 'hooks/ConfirmDialogProvider';
import ViewDataTableSearch from './ViewDataTableSearch';
import ViewDataTableSorting from './ViewDataTableSorting';
import { GridColDef, GridSortModel } from '@mui/x-data-grid-pro';

export interface ViewDataTableToolbarProps {
  disabled: boolean;
  gridColumns: GridColDef[];
  isSmartSearch: boolean;
  onColumnCreate: () => void;
  onRowsRemove: () => void;
  onViewCreate: () => void;
  selection: number[];
  setQuickSearch: (quickSearch: string) => void;
  setSortModel: (model: GridSortModel) => void;
  sortModel: GridSortModel;
}

const ViewDataTableToolbar: React.FunctionComponent<
  ViewDataTableToolbarProps
> = ({
  disabled,
  gridColumns,
  isSmartSearch,
  onColumnCreate,
  onRowsRemove,
  onViewCreate,
  selection,
  setQuickSearch,
  setSortModel,
  sortModel,
}) => {
  const intl = useIntl();
  const { showConfirmDialog } = useContext(ConfirmDialogContext);

  const onClickRemoveRows = () => {
    showConfirmDialog({
      onSubmit: onRowsRemove,
      title: intl.formatMessage({ id: 'misc.views.removeDialog.title' }),
      warningText: intl.formatMessage({
        id: 'misc.views.removeDialog.action',
      }),
    });
  };
  return (
    <Box display="flex" justifyContent="flex-end" role="toolbar">
      <Slide direction="left" in={!!selection.length} timeout={150}>
        <Button
          data-testid="ViewDataTableToolbar-createFromSelection"
          disabled={disabled}
          onClick={onViewCreate}
          startIcon={<Launch />}
        >
          <FormattedMessage id="misc.views.toolbar.createFromSelection" />
        </Button>
      </Slide>
      <Slide direction="left" in={!!selection.length} timeout={100}>
        <Tooltip
          title={
            isSmartSearch
              ? intl.formatMessage({
                  id: 'misc.views.toolbar.removeTooltip',
                })
              : ''
          }
        >
          <span>
            <Button
              data-testid="ViewDataTableToolbar-removeFromSelection"
              disabled={isSmartSearch || disabled}
              onClick={onClickRemoveRows}
              startIcon={<RemoveCircleOutline />}
            >
              <FormattedMessage
                id="misc.views.toolbar.removeFromSelection"
                values={{ numSelected: selection.length }}
              />
            </Button>
          </span>
        </Tooltip>
      </Slide>
      <GridToolbarFilterButton
        componentsProps={{
          button: { color: 'default', size: 'medium' },
        }}
      />
      <ViewDataTableSorting {...{ gridColumns, setSortModel, sortModel }} />
      <Button
        data-testid="ViewDataTableToolbar-createColumn"
        disabled={disabled}
        onClick={onColumnCreate}
        startIcon={<Add />}
      >
        <FormattedMessage id="misc.views.toolbar.createColumn" />
      </Button>
      <ViewDataTableSearch
        onChange={(searchString) => setQuickSearch(searchString)}
      />
    </Box>
  );
};

export default ViewDataTableToolbar;
