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

interface ZUICreatePersonProps {
  onClose: () => void;
  onSubmit: (ids: number[]) => void;
  open: boolean;
  title: string;
}

const ZUIBulkPersonSelect: FC<ZUICreatePersonProps> = ({
  open,
  onClose,
  onSubmit,
  title,
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
      <Box sx={{ p: 2 }}>
        <DialogTitle sx={{ paddingLeft: 1 }} variant="h4">
          {title}
        </DialogTitle>
        {!!viewId && (
          <ViewStep
            onBack={() => setViewId(null)}
            onSubmit={(ids) => onSubmit(ids)}
            orgId={orgId}
            viewId={viewId}
          />
        )}
        {!viewId && (
          <BrowserStep
            folderId={folderId}
            onClose={onClose}
            onFolderSelect={(id) => setFolderId(id)}
            onViewSelect={(viewId) => setViewId(viewId)}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default ZUIBulkPersonSelect;
