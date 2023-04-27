import { IconButton, TextField, useAutocomplete } from '@mui/material';
import Fuse from 'fuse.js';
import SearchIcon from '@mui/icons-material/Search';

import EventDataModel from 'features/events/models/EventDataModel';

interface EventParticipansFilterProps {
  model: EventDataModel;
}
const EventParticipantsFilter = ({ model }: EventParticipansFilterProps) => {
  const participantsList = model.getParticipants().data ?? [];
  const participants = new Fuse(participantsList, {
    // findAllMatches: true,
    shouldSort: true,
    keys: [
      { name: 'first_name', weight: 1.0 },
      { name: 'last_name', weight: 0.8 },
      'phone',
      'email',
    ],
    // keys: ['first_name', 'last_name', 'phone', 'email'],
    // threshold: 0.4,
  });
  //   const { getInputProps, getListboxProps, getRootProps, groupedOptions } =
  //     useAutocomplete({
  //       filterOptions: (options, { inputValue }) => {
  //         const searchedParticipants = participants.search(inputValue);
  //         console.log(searchedParticipants, ' resu');
  //         return searchedParticipants;
  //       },
  //       //   getOptionLabel: (option) => option.title,
  //       //   inputValue: inputValue,
  //       open: true,
  //       options: [model.getParticipants()],
  //     });

  //   const tfProps = getInputProps();

  const filterInput = (input: string) => {
    const searchedParticipants = participants.search(input);
    console.info(`=-----------------------`);
    searchedParticipants.forEach((item) =>
      console.info(`${item.item.first_name}, ${item.item.last_name}`)
    );
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
