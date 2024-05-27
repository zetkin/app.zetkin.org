import theme from 'theme';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
} from '@mui/material';
import { FC, useState } from 'react';

import DuplicatesModalList from './DuplicatesModalList';
import messageIds from '../l10n/messageIds';
import NotDuplicatesModalList from './NotDuplicatesModalList';
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
  const [maxWidth, setMaxWidth] = useState<'sm' | 'lg'>('lg');

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      onClose={() => {
        onClose();
        setMaxWidth('sm');
      }}
      open={open}
    >
      <DialogTitle variant="h5">{messages.modal.title()}</DialogTitle>
      <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
        <DuplicatesModalList duplicate={duplicate} />
        <NotDuplicatesModalList duplicate={duplicate} />
      </Box>
      <DialogActions>
        <Button variant="text">{messages.modal.cancelButton()}</Button>
        <Button variant="contained">{messages.modal.mergeButton()}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigureModal;
