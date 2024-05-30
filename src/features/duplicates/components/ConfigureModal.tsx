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
import { PotentialDuplicate } from '../store';
import PotentialDuplicatesLists from './PotentialDuplicatesLists';
import useFieldSettings from '../hooks/useFieldSettings';
import { useMessages } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';

export interface SelectedPerson {
  id: number;
  selected: boolean;
}

interface ConfigureModalProps {
  potentialDuplicate: PotentialDuplicate;
  onClose: () => void;
  open: boolean;
}

const ConfigureModal: FC<ConfigureModalProps> = ({
  potentialDuplicate,
  open,
  onClose,
}) => {
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const messages = useMessages(messageIds);
  const [maxWidth, setMaxWidth] = useState<'sm' | 'lg'>('lg');

  const potentialDuplicatesPersons: SelectedPerson[] =
    potentialDuplicate?.duplicates.map((person) => ({
      id: person.id,
      selected: false,
    }));

  const [selectedPeople, setSelectedPeople] = useState<SelectedPerson[]>(
    potentialDuplicatesPersons
  );
  const [peopleToMerge, setPeopleToMerge] = useState<ZetkinPerson[]>(
    potentialDuplicate?.duplicates
  );
  const [peopleNoToMerge, setPeopleNoToMerge] = useState<ZetkinPerson[]>([]);

  function getPeopleForFields(
    selectedPersons: SelectedPerson[]
  ): ZetkinPerson[] {
    const matchingValues = potentialDuplicate.duplicates.filter((item) => {
      const person = selectedPersons.find((person) => person.id === item.id);
      return person && !person.selected;
    });

    setPeopleToMerge(matchingValues);
    return matchingValues;
  }

  function getPeopleNoToMerge(
    selectedPersons: SelectedPerson[]
  ): ZetkinPerson[] {
    const matchingValues = potentialDuplicate.duplicates.filter((item) => {
      const person = selectedPersons.find((person) => person.id === item.id);
      return person && person.selected;
    });

    setPeopleNoToMerge(matchingValues);
    return matchingValues;
  }

  const handleChangeOfTable = (person: ZetkinPerson) => {
    const index = selectedPeople.findIndex((item) => item.id === person.id);
    const personToHandle = selectedPeople[index];

    if (personToHandle?.selected) {
      selectedPeople[index].selected = false;
      setSelectedPeople(selectedPeople);
      getPeopleForFields(selectedPeople);
      getPeopleNoToMerge(selectedPeople);
    } else {
      selectedPeople[index].selected = true;
      setSelectedPeople(selectedPeople);
      getPeopleNoToMerge(selectedPeople);
      getPeopleForFields(selectedPeople);
    }
  };

  const { fieldValues, initialOverrides } = useFieldSettings(peopleToMerge);
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
          <PotentialDuplicatesLists
            handleChangeOfTable={handleChangeOfTable}
            peopleNoToMerge={peopleNoToMerge}
            peopleToMerge={peopleToMerge}
          />
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
