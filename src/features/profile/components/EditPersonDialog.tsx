import { Close } from '@mui/icons-material';
import { FC } from 'react';
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';

interface EditPersonDialogProps {
  onClose: () => void;
  open: boolean;
  person: ZetkinPerson;
}

const EditPersonDialog: FC<EditPersonDialogProps> = ({
  open,
  onClose,
  person,
}) => {
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
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        p={2}
      >
        <Typography fontSize="1.4em" variant="h4">
          <Msg
            id={messageIds.editPersonHeader}
            values={{ person: person.first_name + ' ' + person.last_name }}
          />
        </Typography>
        <IconButton
          onClick={() => {
            onClose();
          }}
        >
          <Close />
        </IconButton>
      </Box>
    </Dialog>
  );
};

export default EditPersonDialog;
