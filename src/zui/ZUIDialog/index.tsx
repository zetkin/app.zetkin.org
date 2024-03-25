import { FunctionComponent } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface ZUIDialogProps {
  children: React.ReactNode;
  contentHeight?: number | string;
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: false | 'sm' | 'md' | 'lg' | 'xl';
}

const ZUIDialog: FunctionComponent<ZUIDialogProps> = ({
  children,
  contentHeight,
  maxWidth,
  open,
  onClose,
  title,
}): JSX.Element => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={maxWidth || 'sm'}
      onClose={onClose}
      open={open}
    >
      <Box p={2}>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent sx={{ height: contentHeight }}>{children}</DialogContent>
      </Box>
    </Dialog>
  );
};

export default ZUIDialog;
