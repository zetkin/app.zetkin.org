import { FunctionComponent } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  NoSsr,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface ZUIDialogProps {
  children: React.ReactNode;
  contentHeight?: number | string;
  open: boolean;
  onClose: () => void;
  onTop?: boolean;
  title?: string;
  maxWidth?: false | 'sm' | 'md' | 'lg' | 'xl';
}

const ZUIDialog: FunctionComponent<ZUIDialogProps> = ({
  children,
  contentHeight,
  maxWidth,
  open,
  onTop,
  onClose,
  title,
}): JSX.Element => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <NoSsr>
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth={maxWidth || 'sm'}
        onClose={onClose}
        open={open}
        sx={{
          zIndex: onTop ? theme.zIndex.tooltip + 9999 : theme.zIndex.modal,
        }}
      >
        <Box p={2}>
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogContent sx={{ height: contentHeight }}>
            {children}
          </DialogContent>
        </Box>
      </Dialog>
    </NoSsr>
  );
};

export default ZUIDialog;
