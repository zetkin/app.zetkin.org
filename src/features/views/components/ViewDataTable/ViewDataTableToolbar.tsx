import { useContext, useState } from 'react';
import {
  Add,
  DeleteOutline,
  Launch,
  RemoveCircleOutline,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
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
import useRootOrganization from 'features/organizations/hooks/useRootOrganization';

export interface ViewDataTableToolbarProps {
  disableBulkActions?: boolean;
  disableConfigure?: boolean;
  disabled: boolean;
  gridColumns: GridColDef[];
  isLoading: boolean;
  isSmartSearch: boolean;
  onColumnCreate: () => void;
  onBulkDelete: () => void;
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
  const rootOrg = useRootOrganization(orgId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletionString, setDeletionString] = useState('');

  const hasSelection = !!selection.length;
  const hasBulkDelete = useFeatureWithOrg(BULK_DELETE, orgId);
  const hasConfirmedDeletion = deletionString === rootOrg.data?.title;

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

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletionString('');
  };

  const handleBulkDelete = () => {
    handleCloseDeleteDialog();
    onBulkDelete();
  };

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
      <Dialog onClose={() => handleCloseDeleteDialog()} open={deleteDialogOpen}>
        <DialogTitle>
          <Msg
            id={messageIds.deleteRowsDialog.title}
            values={{ numPeople: selection.length }}
          />
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Alert severity="warning">
            <Msg id={messageIds.deleteRowsDialog.destructiveAlert} />
          </Alert>
          <DialogContentText>
            <Msg
              id={messageIds.deleteRowsDialog.tagetOrgWarning}
              values={{
                rootOrgTitle: (
                  <Box component="strong">{rootOrg.data?.title ?? ''}</Box>
                ),
              }}
            />
          </DialogContentText>
          <DialogContentText>
            <Msg
              id={messageIds.deleteRowsDialog.instruction}
              values={{
                rootOrgSlug: (
                  <Box component="b">{rootOrg.data?.title ?? ''}</Box>
                ),
              }}
            />
          </DialogContentText>
          <TextField
            label={messages.deleteRowsDialog.confirmationInputLabel()}
            onChange={(evt) => setDeletionString(evt.target.value)}
            size="small"
            value={deletionString}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDeleteDialog()}>
            <Msg id={messageIds.deleteRowsDialog.cancelButton} />
          </Button>
          <Button
            color="error"
            disabled={!hasConfirmedDeletion}
            onClick={() => handleBulkDelete()}
            variant="contained"
          >
            <Msg id={messageIds.deleteRowsDialog.confirmButton} />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewDataTableToolbar;
