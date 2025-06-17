import { Box, Button, DialogTitle, Divider } from '@mui/material';
import { FC, useState } from 'react';

import useView from 'features/views/hooks/useView';
import messageIds from 'zui/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ZUIFutures from 'zui/ZUIFutures';
import ViewDataTable from 'features/views/components/ViewDataTable';
import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import ZUIConfirmDialog from 'zui/ZUIConfirmDialog';

type Props = {
  entityToAddTo?: string;
  onBack: () => void;
  onSubmit: (ids: number[]) => void;
  orgId: number;
  viewId: number;
};

const MIN_SELECTION_FOR_CONFIRMATION = 30;

const ViewStep: FC<Props> = ({
  entityToAddTo,
  onBack,
  onSubmit,
  orgId,
  viewId,
}) => {
  const viewFuture = useView(orgId, viewId);
  const { columnsFuture, rowsFuture } = useViewGrid(orgId, viewId);
  const [selectedPersonIds, setSelectedPersonIds] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const messages = useMessages(messageIds);

  const hasSelection = selectedPersonIds.length > 0;

  const handleSubmitClick = () => {
    if (selectedPersonIds.length > MIN_SELECTION_FOR_CONFIRMATION) {
      setIsConfirmOpen(true);
      return;
    }
    onSubmit(selectedPersonIds);
  };

  const handleConfirm = () => {
    onSubmit(selectedPersonIds);
    setIsConfirmOpen(false);
  };

  return (
    <ZUIFutures
      futures={{ columns: columnsFuture, rows: rowsFuture, view: viewFuture }}
    >
      {({ data: { columns, rows, view } }) => {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: '100%',
              position: 'relative',
            }}
          >
            <DialogTitle sx={{ paddingLeft: 1, paddingTop: 0 }} variant="h5">
              <Msg
                id={messageIds.personSelect.bulkAdd.fromView}
                values={{ viewTitle: view.title }}
              />
            </DialogTitle>
            <AccessLevelProvider accessLevel="readonly" isRestricted={true}>
              <ViewDataTable
                columns={columns}
                disableAdd
                disableConfigure
                rows={rows}
                rowSelection={{
                  mode: 'select',
                  onSelectionChange: setSelectedPersonIds,
                  selectedIds: selectedPersonIds,
                }}
                view={view}
              />
            </AccessLevelProvider>
            <Divider />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                mt: 2,
              }}
            >
              <Box>
                <Button
                  onClick={() => {
                    onBack();
                  }}
                  sx={{ mr: 2 }}
                  variant="text"
                >
                  <Msg id={messageIds.personSelect.bulkAdd.backButton} />
                </Button>
                <Button
                  disabled={!hasSelection}
                  onClick={handleSubmitClick}
                  sx={{ mr: 2 }}
                  variant="contained"
                >
                  <Msg
                    id={messageIds.personSelect.bulkAdd.submitButton}
                    values={{ numSelected: selectedPersonIds.length }}
                  />
                </Button>
              </Box>
            </Box>
            <ZUIConfirmDialog
              onCancel={() => setIsConfirmOpen(false)}
              onSubmit={handleConfirm}
              open={isConfirmOpen}
              title={messages.personSelect.bulkAdd.confirmTitle()}
              warningText={messages.personSelect.bulkAdd.confirmMessage({
                count: selectedPersonIds.length,
                entityToAddTo: entityToAddTo,
              })}
            />
          </Box>
        );
      }}
    </ZUIFutures>
  );
};

export default ViewStep;
