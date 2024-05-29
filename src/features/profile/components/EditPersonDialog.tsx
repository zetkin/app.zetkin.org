import { FC } from 'react';
import { useTheme } from '@mui/material';
import { Box, Dialog, useMediaQuery } from '@mui/material';

interface EditPersonDialogProps {
  onClose: () => void;
  open: boolean;
}

const EditPersonDialog: FC<EditPersonDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        onClose();
      }}
      open={open}
    >
      <Box>I am an Edit Person Dialog</Box>
    </Dialog>
  );
};

export default EditPersonDialog;
