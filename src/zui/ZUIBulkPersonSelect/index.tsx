import {
  Box,
  Dialog,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

import BrowserStep from './BrowserStep';
import ViewStep from './ViewStep';
import { useNumericRouteParams } from 'core/hooks';
import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';

interface ZUICreatePersonProps {
  entityToAddTo?: string;
  onClose: () => void;
  onSubmit: (ids: number[]) => void;
  open: boolean;
}

const ZUIBulkPersonSelect: FC<ZUICreatePersonProps> = ({
  entityToAddTo,
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [folderId, setFolderId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setFolderId(null);
      setViewId(null);
    }
  }, [open]);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xl"
      onClose={() => {
        onClose();
      }}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: '100%',
          p: 2,
        }}
      >
        <DialogTitle sx={{ p: 1 }} variant="h4">
          <Msg
            id={messageIds.personSelect.bulkAdd.title}
            values={{ entityToAddTo }}
          />
        </DialogTitle>
        {!viewId && (
          <BrowserStep
            folderId={folderId}
            onClose={onClose}
            onFolderSelect={(id) => setFolderId(id)}
            onViewSelect={(viewId) => setViewId(viewId)}
          />
        )}
        {!!viewId && (
          <ViewStep
            entityToAddTo={entityToAddTo}
            onBack={() => setViewId(null)}
            onSubmit={(ids) => onSubmit(ids)}
            orgId={orgId}
            viewId={viewId}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default ZUIBulkPersonSelect;
