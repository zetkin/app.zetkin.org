import ClearIcon from '@mui/icons-material/Clear';
import Fuse from 'fuse.js';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, TextField } from '@mui/material';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from '../l10n/messageIds';
import useDebounce from 'utils/hooks/useDebounce';
import { useMessages } from 'core/i18n';
import { useState } from 'react';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

interface EventParticipansFilterProps {
  model: EventDataModel;
  onFilterCleared: (value: boolean) => void;
  onFilterParticipants: (value: ZetkinEventParticipant[]) => void;
  onFilterSignUp: (value: ZetkinEventResponse[]) => void;
}
const EventParticipantsFilter = ({
  model,
  onFilterCleared,
  onFilterParticipants,
  onFilterSignUp,
}: EventParticipansFilterProps) => {
  const [userInput, setUserInput] = useState<string>('');
  const participantsList = model.getParticipants().data ?? [];
  const signUpList = model.getPendingSignUps();
  const messages = useMessages(messageIds);

  const debouncedFinishedTyping = useDebounce(
    async (
      value: string,
      participantsList: ZetkinEventParticipant[],
      signUpList: ZetkinEventResponse[]
    ) => {
      filterInput(value, participantsList, signUpList);
    },
    300
  );
  //TODO filter cancelled list when API supports it
  const filterInput = (
    input: string,
    participantsList: ZetkinEventParticipant[],
    signUpList: ZetkinEventResponse[]
  ) => {
    if (input === '') {
      onFilterCleared(true);
    }

    if (input !== '') {
      const tokens = input.trim().split(/\s+/);
      const signUpFuseList = new Fuse(signUpList, {
        includeScore: true,
        keys: [
          { name: 'person.first_name', weight: 1.0 },
          { name: 'person.last_name', weight: 0.8 },
          { name: 'person.phone', weight: 0.8 },
          { name: 'person.email', weight: 0.8 },
        ],
        threshold: 0.4,
      });

      const participantsFuseList = new Fuse(participantsList, {
        includeScore: true,
        keys: [
          { name: 'first_name', weight: 1.0 },
          { name: 'last_name', weight: 0.8 },
          { name: 'phone', weight: 0.8 },
          { name: 'email', weight: 0.8 },
        ],
        threshold: 0.4,
      });

      const filteredSignUp = signUpFuseList
        .search({
          $and: tokens.map((searchToken: string) => {
            const orFields: Fuse.Expression[] = [
              { $path: ['person', 'first_name'], $val: searchToken },
              { $path: ['person', 'last_name'], $val: searchToken },
              { $path: ['person', 'phone'], $val: searchToken },
              { $path: ['person', 'email'], $val: searchToken },
            ];

            return {
              $or: orFields,
            };
          }),
        })
        .map((fuseResult) => fuseResult.item);

      const filteredParticipants = participantsFuseList
        .search({
          $and: tokens.map((searchToken: string) => {
            const orFields: Fuse.Expression[] = [
              { first_name: searchToken },
              { last_name: searchToken },
              { email: searchToken },
              { phone: searchToken },
            ];

            return {
              $or: orFields,
            };
          }),
        })
        .map((fuseResult) => fuseResult.item);

      onFilterSignUp(filteredSignUp);
      onFilterParticipants(filteredParticipants);
    }
  };

  return (
    <TextField
      color="primary"
      InputProps={{
        endAdornment: (
          <IconButton>
            <ClearIcon
              onClick={() => {
                setUserInput('');
                onFilterCleared(true);
              }}
            />
          </IconButton>
        ),
        startAdornment: <SearchIcon color="secondary" sx={{ mr: 1 }} />,
      }}
      onChange={(e) => {
        e.target.value ? onFilterCleared(false) : onFilterCleared(true);
        setUserInput(e.target.value);
        debouncedFinishedTyping(e.target.value, participantsList, signUpList);
      }}
      placeholder={messages.search()}
      size="small"
      sx={{ width: '230px' }}
      value={userInput}
      variant="outlined"
    />
  );
};

export default EventParticipantsFilter;
