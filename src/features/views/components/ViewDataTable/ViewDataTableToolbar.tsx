import { useContext } from 'react';
import { Add, Launch, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, Slide, Tooltip } from '@mui/material';
import {
  DataGridProProps,
  GridColDef,
  GridSortModel,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import { FormattedMessage, useIntl } from 'react-intl';

import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDataTableSearch from 'zui/ZUIDataTableSearch';
import ZUIDataTableSorting from 'zui/ZUIDataTableSorting';

export interface ViewDataTableToolbarProps {
  disableConfigure?: boolean;
  disabled: boolean;
  gridColumns: GridColDef[];
  isSmartSearch: boolean;
  onColumnCreate: () => void;
  onRowsRemove: () => void;
  onViewCreate: () => void;
  selection: number[];
  setQuickSearch: (quickSearch: string) => void;
  onSortModelChange: DataGridProProps['onSortModelChange'];
  sortModel: GridSortModel;
}

const ViewDataTableToolbar: React.FunctionComponent<
  ViewDataTableToolbarProps
> = ({
  disableConfigure,
  disabled,
  gridColumns,
  isSmartSearch,
  onColumnCreate,
  onRowsRemove,
  onViewCreate,
  selection,
  setQuickSearch,
  onSortModelChange,
  sortModel,
}) => {
  const intl = useIntl();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

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
    <Box role="toolbar">
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
          button: { color: 'secondary', size: 'medium' },
        }}
      />
      <ZUIDataTableSorting
        gridColumns={gridColumns}
        onSortModelChange={(model) =>
          onSortModelChange && onSortModelChange(model, {})
        }
        sortModel={sortModel}
      />
      {!disableConfigure && (
        <Button
          color="secondary"
          data-testid="ViewDataTableToolbar-createColumn"
          disabled={disabled}
          onClick={onColumnCreate}
          startIcon={<Add />}
        >
          <FormattedMessage id="misc.views.toolbar.createColumn" />
        </Button>
      )}
      <ZUIDataTableSearch
        onChange={(searchString) => setQuickSearch(searchString)}
      />
    </Box>
  );
};

export default ViewDataTableToolbar;
