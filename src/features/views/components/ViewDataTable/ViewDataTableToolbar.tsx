import { useContext } from 'react';
import { Add, Launch, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Button, CircularProgress, Slide, Tooltip } from '@mui/material';
import {
  DataGridProProps,
  GridColDef,
  GridSortModel,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';

import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDataTableSearch from 'zui/ZUIDataTableSearch';
import ZUIDataTableSorting from 'zui/ZUIDataTableSorting';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';

export interface ViewDataTableToolbarProps {
  disableConfigure?: boolean;
  disabled: boolean;
  gridColumns: GridColDef[];
  isLoading: boolean;
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
  isLoading,
  isSmartSearch,
  onColumnCreate,
  onRowsRemove,
  onViewCreate,
  selection,
  setQuickSearch,
  onSortModelChange,
  sortModel,
}) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const onClickRemoveRows = () => {
    showConfirmDialog({
      onSubmit: onRowsRemove,
      title: messages.removeDialog.title(),
      warningText: messages.removeDialog.action(),
    });
  };
  return (
    <Box role="toolbar">
      {!isLoading && (
        <Slide direction="left" in={!!selection.length} timeout={150}>
          <Button
            data-testid="ViewDataTableToolbar-createFromSelection"
            disabled={disabled}
            onClick={onViewCreate}
            startIcon={<Launch />}
          >
            <Msg id={messageIds.toolbar.createFromSelection} />
          </Button>
        </Slide>
      )}
      {isLoading && (
        <Button disabled={disabled} startIcon={<Launch />}>
          <CircularProgress size={25} />
        </Button>
      )}
      <Slide direction="left" in={!!selection.length} timeout={100}>
        <Tooltip title={isSmartSearch ? messages.toolbar.removeTooltip() : ''}>
          <span>
            <Button
              data-testid="ViewDataTableToolbar-removeFromSelection"
              disabled={isSmartSearch || disabled}
              onClick={onClickRemoveRows}
              startIcon={<RemoveCircleOutline />}
            >
              <Msg
                id={messageIds.toolbar.removeFromSelection}
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
          <Msg id={messageIds.toolbar.createColumn} />
        </Button>
      )}
      <ZUIDataTableSearch
        onChange={(searchString) => setQuickSearch(searchString)}
      />
    </Box>
  );
};

export default ViewDataTableToolbar;
