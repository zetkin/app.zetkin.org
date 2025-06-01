import { Box, Dialog, useMediaQuery, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import BrowserStep from './BrowserStep';
import ViewStep from './ViewStep';
import { useNumericRouteParams } from 'core/hooks';

interface ZUICreatePersonProps {
  onClose: () => void;
  onSubmit: (ids: number[]) => void;
  open: boolean;
}

const ZUIBulkPersonSelect: FC<ZUICreatePersonProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [viewId, setViewId] = useState<number | null>(null);

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
            onClose={onClose}
            onViewSelect={(viewId) => setViewId(viewId)}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default ZUIBulkPersonSelect;
