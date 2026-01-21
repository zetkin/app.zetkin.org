import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
} from '@mui/material';
import { FC, useState } from 'react';
import React, { useEffect } from 'react';

import oldTheme from 'theme';
import FieldSettings from './FieldSettings';
import messageIds from '../l10n/messageIds';
import PotentialDuplicatesLists from './PotentialDuplicatesLists';
import { useMessages } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';
import { useNumericRouteParams } from 'core/hooks';
import useDetailedPersons from '../hooks/useDetailedPerson';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import ZUIFutures from 'zui/ZUIFutures';

type Props = {
  initiallyShowManualSearch?: boolean;
  onClose: () => void;
  onMerge: (personIds: number[], overrides: Partial<ZetkinPerson>) => void;
  open: boolean;
  persons: ZetkinPerson[];
};

const MergeModal: FC<Props> = ({
  initiallyShowManualSearch = false,
  open,
  onClose,
  onMerge,
  persons,
}) => {
  const fullScreen = useMediaQuery(oldTheme.breakpoints.down('md'));
  const messages = useMessages(messageIds);
  const [additionalPeople, setAdditionalPeople] = useState<ZetkinPerson[]>([]);

  const [selectedIds, setSelectedIds] = useState<number[]>(
    persons.map((person) => person.id)
  );

  const { orgId } = useNumericRouteParams();
  const customFields = useCustomFields(orgId);

  const peopleToMerge = [
    ...persons.filter((person) => selectedIds.includes(person.id)),
    ...additionalPeople,
  ];

  const detailedPersons = useDetailedPersons(
    orgId,
    peopleToMerge.map((person) => person.id)
  );

  const peopleNotToMerge = persons.filter(
    (person) => !selectedIds.includes(person.id)
  );

  const [overrides, setOverrides] = useState<Partial<ZetkinPerson> | null>(
    null
  );

  useEffect(() => {
    setSelectedIds(persons.map((person) => person.id) ?? []);
  }, [open]);

  return (
    <Dialog fullScreen={fullScreen} fullWidth maxWidth="lg" open={open}>
      <DialogTitle sx={{ paddingLeft: 2 }} variant="h5">
        {messages.modal.title()}
      </DialogTitle>
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box paddingX={2} sx={{ overflowY: 'auto' }} width="50%">
          <PotentialDuplicatesLists
            initiallyShowManualSearch={initiallyShowManualSearch}
            onDeselect={(person: ZetkinPerson) => {
              const isPredefined = persons.some(
                (predefinedPerson) => predefinedPerson.id == person.id
              );

              if (isPredefined) {
                const filteredIds = selectedIds.filter(
                  (item) => item !== person.id
                );
                setSelectedIds(filteredIds);
              } else {
                const filteredAdditionals = additionalPeople.filter(
                  (item) => item.id != person.id
                );
                setAdditionalPeople(filteredAdditionals);
              }
            }}
            onSelect={(person: ZetkinPerson) => {
              const isPredefined = persons.some(
                (predefinedPerson) => predefinedPerson.id == person.id
              );
              if (isPredefined) {
                const selectedIdsUpdated = [...selectedIds, person.id];
                setSelectedIds(selectedIdsUpdated);
              } else {
                setAdditionalPeople([...additionalPeople, person]);
              }
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
          <ZUIFutures futures={{ customFields, detailedPersons }}>
            {({ data: { customFields, detailedPersons } }) => (
              <FieldSettings
                customFields={customFields}
                duplicates={detailedPersons}
                onChange={(field, value) => {
                  if (overrides) {
                    setOverrides({ ...overrides, [`${field}`]: value });
                  }
                }}
                setOverrides={setOverrides}
              />
            )}
          </ZUIFutures>
        </Box>
      </Box>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => {
            setAdditionalPeople([]);
            onClose();
          }}
          variant="text"
        >
          {messages.modal.cancelButton()}
        </Button>
        <Button
          disabled={
            !overrides || additionalPeople.length + selectedIds.length <= 1
          }
          onClick={() => {
            if (!overrides) {
              // This should never happen, because we disable the button above when `overrides` is falsy
              throw new Error(
                'Operation not allowed. Merge data not available'
              );
            }
            const idSet = new Set([
              ...selectedIds,
              ...additionalPeople.map((person) => person.id),
            ]);
            onMerge(Array.from(idSet), overrides);
            setAdditionalPeople([]);
          }}
          variant="contained"
        >
          {messages.modal.mergeButton()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MergeModal;
