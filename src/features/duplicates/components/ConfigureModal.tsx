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
import FieldSettings from './FieldSettings';
import messageIds from '../l10n/messageIds';
import NotDuplicatesModalList from './NotDuplicatesModalList';
import { PotentialDuplicate } from '../store';
import useFieldSettings from '../hooks/useFieldSettings';
import { useMessages } from 'core/i18n';

interface ConfigureModalProps {
  duplicate: PotentialDuplicate;
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
  const { fieldValues, initialOverrides } = useFieldSettings(
    duplicate.duplicates
  );
  const [overrides, setOverrides] = useState(initialOverrides);

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
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box
          display="flex"
          flexDirection="column"
          sx={{ overflowY: 'auto' }}
          width="50%"
        >
          <DuplicatesModalList duplicate={duplicate} />
          <NotDuplicatesModalList duplicate={duplicate} />
        </Box>
        <Box display="flex" flexDirection="column" width="50%">
          <FieldSettings
            fieldValues={fieldValues}
            onChange={(field, value) => {
              setOverrides({ ...overrides, [`${field}`]: value });
            }}
          />
        </Box>
      </Box>
      <DialogActions>
        <Button variant="text">{messages.modal.cancelButton()}</Button>
        <Button variant="contained">{messages.modal.mergeButton()}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigureModal;
