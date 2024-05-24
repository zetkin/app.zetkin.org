import { FC } from 'react';
import theme from 'theme';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
} from '@mui/material';

import FieldSettings from './FieldSettings';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinDuplicate } from '../store';

interface ConfigureModalProps {
  duplicate: ZetkinDuplicate;
  onClose: () => void;
  open: boolean;
}

const ConfigureModal: FC<ConfigureModalProps> = ({
  duplicate,
  open,
  onClose,
}) => {
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const messages = useMessages(messageIds);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        onClose();
      }}
      open={open}
    >
      <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
        <DialogTitle variant="h5">{messages.modal.title()}</DialogTitle>
      </Box>
      <Box display="flex" flexDirection="column">
        <FieldSettings duplicatePersons={duplicate.duplicatePersons} />
      </Box>
      <DialogActions>
        <Button variant="text">{messages.modal.cancelButton()}</Button>
        <Button variant="contained">{messages.modal.mergeButton()}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigureModal;
