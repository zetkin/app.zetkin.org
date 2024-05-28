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

import FieldSettings from './FieldSettings';
import messageIds from '../l10n/messageIds';
import useFieldSettings from '../hooks/useFieldSettings';
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
  const { fieldValues, initialOverrides } = useFieldSettings(
    duplicate.duplicatePersons
  );
  const [overrides, setOverrides] = useState(initialOverrides);

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
        <FieldSettings
          fieldValues={fieldValues}
          onChange={(field, value) => {
            setOverrides({ ...overrides, [`${field}`]: value });
          }}
        />
      </Box>
      <DialogActions>
        <Button variant="text">{messages.modal.cancelButton()}</Button>
        <Button variant="contained">{messages.modal.mergeButton()}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigureModal;
