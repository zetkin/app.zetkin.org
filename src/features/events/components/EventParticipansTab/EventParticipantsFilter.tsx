import { TextField, useAutocomplete } from '@mui/material';
import EventDataModel from 'features/events/models/EventDataModel';
import Fuse from 'fuse.js';

interface EventParticipansFilterProps {
  model: EventDataModel;
}
const EventParticipantsFilter = ({ model }: EventParticipansFilterProps) => {
  const participantsList = model.getParticipants().data ?? [];
  const participants = new Fuse(participantsList, {
    // findAllMatches: true,
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
    />
  );
};

export default EventParticipantsFilter;
