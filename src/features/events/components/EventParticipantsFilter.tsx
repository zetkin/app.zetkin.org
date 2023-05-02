import { TextField } from '@mui/material';
import Fuse from 'fuse.js';
import SearchIcon from '@mui/icons-material/Search';

import EventDataModel from 'features/events/models/EventDataModel';

interface EventParticipansFilterProps {
  model: EventDataModel;
}
const EventParticipantsFilter = ({ model }: EventParticipansFilterProps) => {
  const participantsList = model.getParticipants().data ?? [];
  const newParticipantsList = participantsList.map((item) => ({
    ...item,
    name: `${item.first_name} ${item.last_name}`,
  }));

  const participantsFuseList = new Fuse(newParticipantsList, {
    includeScore: true,
    keys: ['first_name', 'last_name', 'phone', 'email'],
    threshold: 0.4,
  });

  const filterInput = (input: string) => {
    const token = input.split(/\s+/);
    return participantsFuseList
      .search({
        $and: token.map((searchToken: string) => {
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
      autoFocus={true}
      color="primary"
      placeholder={'hello'}
      size="small"
      variant="outlined"
      onChange={(e) => filterInput(e.target.value)}
      InputProps={{
        startAdornment: <SearchIcon sx={{ mr: 1 }} color="secondary" />,
      }}
    />
  );
};

export default EventParticipantsFilter;
