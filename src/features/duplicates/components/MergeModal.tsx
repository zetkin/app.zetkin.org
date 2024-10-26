import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
} from '@mui/material';
import { FC, useState } from 'react';
import React, { useEffect } from 'react';

import theme from 'theme';
import FieldSettings from './FieldSettings';
import messageIds from '../l10n/messageIds';
import PotentialDuplicatesLists from './PotentialDuplicatesLists';
import useFieldSettings from '../hooks/useFieldSettings';
import { useMessages } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';

type Props = {
  onClose: () => void;
  onMerge: (personIds: number[], overrides: Partial<ZetkinPerson>) => void;
  open: boolean;
  persons: ZetkinPerson[];
};

const MergeModal: FC<Props> = ({ open, onClose, onMerge, persons }) => {
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const messages = useMessages(messageIds);

  const [selectedIds, setSelectedIds] = useState<number[]>(
    persons.map((person) => person.id) ?? []
  );

  const peopleToMerge = persons.filter((person) =>
    selectedIds.includes(person.id)
  );

  const peopleNotToMerge = persons.filter(
    (person) => !selectedIds.includes(person.id)
  );

  const { hasConflictingValues, fieldValues, initialOverrides } =
    useFieldSettings(peopleToMerge);
  const [overrides, setOverrides] = useState(initialOverrides);

  useEffect(() => {
    setSelectedIds(persons.map((person) => person.id) ?? []);
  }, [open]);

  return (
    <Dialog fullScreen={fullScreen} maxWidth={'lg'} open={open}>
      <DialogTitle sx={{ paddingLeft: 2 }} variant="h5">
        {messages.modal.title()}
      </DialogTitle>
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box paddingX={2} sx={{ overflowY: 'auto' }} width="50%">
          <PotentialDuplicatesLists
            onDeselect={(person: ZetkinPerson) => {
              const filteredIds = selectedIds.filter(
                (item) => item !== person.id
              );
              setSelectedIds(filteredIds);
            }}
            onSelect={(person: ZetkinPerson) => {
              const selectedIdsUpdated = [...selectedIds, person.id];
              setSelectedIds(selectedIdsUpdated);
            }}
            peopleNotToMerge={peopleNotToMerge}
            peopleToMerge={peopleToMerge}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          marginRight={2}
          sx={{ overflowY: 'auto' }}
          width="50%"
        >
          <FieldSettings
            duplicates={peopleToMerge}
            fieldValues={fieldValues}
            onChange={(field, value) => {
              setOverrides({ ...overrides, [`${field}`]: value });
            }}
          />
          <Box marginBottom={2} />
          {hasConflictingValues && (
            <Alert severity="warning">
              <AlertTitle>{messages.modal.warningTitle()}</AlertTitle>
              {messages.modal.warningMessage()}
            </Alert>
          )}
        </Box>
      </Box>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => onClose()} variant="text">
          {messages.modal.cancelButton()}
        </Button>
        <Button
          disabled={selectedIds.length > 1 ? false : true}
          onClick={() => onMerge(selectedIds, overrides)}
          variant="contained"
        >
          {messages.modal.mergeButton()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MergeModal;
