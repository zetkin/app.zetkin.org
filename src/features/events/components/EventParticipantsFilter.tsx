import Fuse from 'fuse.js';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from '../l10n/messageIds';
import useDebounce from 'utils/hooks/useDebounce';
import { useMessages } from 'core/i18n';

interface EventParticipansFilterProps {
  model: EventDataModel;
}
const EventParticipantsFilter = ({ model }: EventParticipansFilterProps) => {
  const messages = useMessages(messageIds);
  const participantsList = model.getParticipants().data ?? [];

  const participantsFuseList = new Fuse(participantsList, {
    includeScore: true,
    keys: ['first_name', 'last_name', 'phone', 'email'],
    threshold: 0.4,
  });

  const debouncedFinishedTyping = useDebounce(async (value: string) => {
    filterInput(value);
  }, 400);

  const filterInput = (input: string) => {
    const tokens = input.trim().split(/\s+/);
    return participantsFuseList
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
  };

  return (
    <TextField
      color="primary"
      InputProps={{
        startAdornment: <SearchIcon color="secondary" sx={{ mr: 1 }} />,
      }}
      onChange={(e) => debouncedFinishedTyping(e.target.value)}
      placeholder={messages.search()}
      size="small"
      sx={{ width: '230px' }}
      variant="outlined"
    />
  );
};

export default EventParticipantsFilter;
