import { useContext, useState } from 'react';
import {
  Add,
  DeleteOutline,
  Launch,
  RemoveCircleOutline,
  Tag,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import {
  DataGridProProps,
  GridColDef,
  GridSortModel,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';

import { useNumericRouteParams } from 'core/hooks';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDataTableSearch from 'zui/ZUIDataTableSearch';
import ZUIDataTableSorting from 'zui/ZUIDataTableSorting';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';
import { BULK_DELETE } from 'utils/featureFlags';
import useFeatureWithOrg from 'utils/featureFlags/useFeatureWithOrg';
import BulkDeleteDialog from './BulkDeleteDialog';
import BulkTagDialog from './BulkTagDialog';
import { ZetkinAppliedTag } from 'utils/types/zetkin';

export interface ViewDataTableToolbarProps {
  disableBulkActions?: boolean;
  disableConfigure?: boolean;
  disabled: boolean;
  gridColumns: GridColDef[];
  isLoading: boolean;
  isSmartSearch: boolean;
  onColumnCreate: () => void;
  onBulkTag: (tags: ZetkinAppliedTag[]) => Promise<void>;
  onBulkDelete: () => Promise<void>;
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
  onBulkDelete,
  onBulkTag,
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
  const { orgId } = useNumericRouteParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);

  const hasSelection = !!selection.length;
  const hasBulkDelete = useFeatureWithOrg(BULK_DELETE, orgId);

  const onClickRemoveRows = () => {
    showConfirmDialog({
      onSubmit: onRowsRemove,
      title: messages.removeDialog.title(),
      warningText: messages.removeDialog.action(),
    });
  };

  const onClickDelete = () => {
    setDeleteDialogOpen(true);
  };

  const bulkActionsForStaticLists = [
    {
      disabled: disabled,
      icon: <RemoveCircleOutline />,
      label: messages.toolbar.bulk.removeFromList(),
      onClick: onClickRemoveRows,
    },
  ];

  const bulkDeletePersons = [
    {
      disabled: disabled,
      icon: <DeleteOutline />,
      label: messages.toolbar.bulk.delete(),
      onClick: onClickDelete,
    },
  ];

  return (
    <>
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
                    {
                      disabled: disabled,
                      icon: <Tag />,
                      label: messages.toolbar.bulk.addTag(),
                      onClick: () => setTagDialogOpen(true),
                    },
                    ...(isSmartSearch ? [] : bulkActionsForStaticLists),

                    ...(hasBulkDelete ? bulkDeletePersons : []),
                  ]}
                  label={messages.toolbar.bulk.handleSelection({
                    numSelected: selection.length,
                  })}
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
              slotProps={{
                button: { color: 'secondary', size: 'medium' },
              }}
            />
            <ZUIDataTableSorting
              gridColumns={gridColumns}
              onSortModelChange={onSortModelChange}
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
      <BulkTagDialog
        numPeople={selection.length}
        onClose={() => setTagDialogOpen(false)}
        open={tagDialogOpen}
        onBulkTag={onBulkTag}
      />
      <BulkDeleteDialog
        numPeople={selection.length}
        onBulkDelete={onBulkDelete}
        onClose={() => setDeleteDialogOpen(false)}
        open={deleteDialogOpen}
        orgId={orgId}
      />
    </>
  );
};

export default ViewDataTableToolbar;
