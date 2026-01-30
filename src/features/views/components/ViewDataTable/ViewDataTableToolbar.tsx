import { useContext } from 'react';
import {
  Add,
  DeleteOutline,
  Launch,
  RemoveCircleOutline,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
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
import ZUIButtonMenu from 'zui/ZUIButtonMenu';

export interface ViewDataTableToolbarProps {
  disableBulkActions?: boolean;
  disableConfigure?: boolean;
  disabled: boolean;
  gridColumns: GridColDef[];
  isLoading: boolean;
  isSmartSearch: boolean;
  onColumnCreate: () => void;
  onRowsDelete: () => void;
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
  disableBulkActions,
  disableConfigure,
  disabled,
  gridColumns,
  isLoading,
  isSmartSearch,
  onColumnCreate,
  onRowsDelete,
  onRowsRemove,
  onViewCreate,
  selection,
  setQuickSearch,
  onSortModelChange,
  sortModel,
}) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const hasSelection = !!selection.length;

  const onClickRemoveRows = () => {
    showConfirmDialog({
      onSubmit: onRowsRemove,
      title: messages.removeDialog.title(),
      warningText: messages.removeDialog.action(),
    });
  };

  const onClickDelete = () => {
    showConfirmDialog({
      onSubmit: onRowsDelete,
      title: messages.deleteRowsDialog.title({ numPeople: selection.length }),
      warningText: messages.deleteRowsDialog.warning(),
    });
  };

  const bulkActionsForStaticLists = [
    {
      disabled: disabled,
      icon: <RemoveCircleOutline />,
      label: messages.toolbar.bulk.removeFromList(),
      onClick: onClickRemoveRows,
    },
  ];

  return (
    <Box role="toolbar">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {!disableBulkActions && (
          <Box
            sx={{
              flexShrink: 0,
              px: 1,
            }}
          >
            {hasSelection && (
              <ZUIButtonMenu
                alignHorizontal="left"
                items={[
                  {
                    disabled: disabled,
                    icon: <Launch />,
                    label: messages.toolbar.bulk.createList(),
                    onClick: onViewCreate,
                  },
                  ...(isSmartSearch ? [] : bulkActionsForStaticLists),
                  {
                    disabled: disabled,
                    icon: <DeleteOutline />,
                    label: messages.toolbar.bulk.delete(),
                    onClick: onClickDelete,
                  },
                ]}
                label={messages.toolbar.bulk.handleSelection()}
                loading={isLoading}
                variant="outlined"
              />
            )}
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
        >
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
      </Box>
    </Box>
  );
};

export default ViewDataTableToolbar;
