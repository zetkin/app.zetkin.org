import { Close } from '@mui/icons-material';
import { FC } from 'react';
import {
  Box,
  Button,
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
    <Dialog fullScreen={fullScreen} fullWidth onClose={onClose} open={open}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        p={2}
      >
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h4">
            <Msg
              id={messageIds.editPersonHeader}
              values={{ person: person.first_name + ' ' + person.last_name }}
            />
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box
          alignItems="center"
          component="div"
          display="flex"
          gap={2}
          justifyContent="flex-end"
          width="100%"
        >
          <Typography color={theme.palette.grey[500]}>
            <Msg
              id={messageIds.numberOfChangesMessage}
              values={{ number: 2 }}
            />
          </Typography>
          <Button disabled={true}>
            <Msg id={messageIds.resetButton} />
          </Button>
          <Button disabled={true} variant="contained">
            <Msg id={messageIds.saveButton} />
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditPersonDialog;
