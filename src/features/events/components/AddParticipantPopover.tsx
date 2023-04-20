import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { FC, HTMLAttributes, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListSubheader,
  Popover,
  TextField,
  Typography,
  useAutocomplete,
} from '@mui/material';

import EventDataModel from '../models/EventDataModel';
import messageIds from '../l10n/messageIds';
import useModel from 'core/useModel';
import { useMessages } from 'core/i18n';
import { usePersonSelect } from 'zui/ZUIPersonSelect';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';

interface AddParticipantPopoverProps {
  anchorEl: Element | null;
  onChangeAnchor: () => void;
  orgId: number;
  eventId: number;
}

const AddParticipantPopover = ({
  anchorEl,
  onChangeAnchor,
  orgId,
  eventId,
}: AddParticipantPopoverProps) => {
  const model = useModel((env) => new EventDataModel(env, orgId, eventId));
  return (
    <Popover
      elevation={1}
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      onClose={() => onChangeAnchor()}
      open={!!anchorEl}
      PaperProps={{
        style: {
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '40vh',
          width: '40vh',
          maxWidth: '400px',
        },
      }}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
    >
      <PopoverContent model={model} />
    </Popover>
  );
};

export default AddParticipantPopover;

interface PopoverContentProps {
  model: EventDataModel;
}

const PopoverContent = ({ model }: PopoverContentProps) => {
  const [value, setValue] = useState<string>('');
  const messages = useMessages(messageIds);

  const handleSelectedPerson = (person: ZetkinPerson) => {
    console.log(person);
    model.addParticipant(person.id);
  };

  const personSelect = usePersonSelect({
    initialValue: '',
    onChange: (person) => {
      handleSelectedPerson(person);
    },
    selectedPerson: null,
  });

  const autoComplete = useAutocomplete({
    ...personSelect.autoCompleteProps,
    onClose: () => {
      setValue('');
    },
  });

  let searchResults = autoComplete.groupedOptions as ZetkinPerson[];

  console.log(autoComplete.getInputProps());

  return (
    <Box mt={1} p={2}>
      <TextField
        autoFocus
        fullWidth
        onChange={(e) => setValue(e.target.value)}
        inputProps={autoComplete.getInputProps()}
        placeholder={messages.addPerson.search()}
        sx={{ paddingLeft: '10px', mb: value ? 2 : 0 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),

          endAdornment: value && (
            <IconButton>
              <ClearIcon />
            </IconButton>
          ),
        }}
      />

      <List
        {...autoComplete.getListboxProps()}
        subheader={
          <ListSubheader sx={{ position: 'relative' }}>
            {autoComplete.inputValue &&
              searchResults.length === 0 &&
              autoComplete.inputValue.length < 3 &&
              autoComplete.inputValue.length > 0 &&
              messages.addPerson.keepTyping()}
            {autoComplete.inputValue.length >= 3 &&
              !personSelect.autoCompleteProps.isLoading &&
              searchResults.length === 0 &&
              messages.addPerson.noResult()}
          </ListSubheader>
        }
        sx={{ px: 3 }}
      >
        {personSelect.autoCompleteProps.isLoading && (
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        )}
        {searchResults.map((option, index) => {
          const optProps = autoComplete.getOptionProps({
            index,
            option,
          });
          return (
            <PersonListItem
              key={option.id}
              orgId={1}
              person={option}
              itemProps={optProps}
            />
          );
        })}
      </List>
    </Box>
  );
};

const PersonListItem: FC<{
  itemProps: HTMLAttributes<HTMLLIElement>;
  orgId: number;
  person: ZetkinPerson;
}> = ({ itemProps, orgId, person }) => {
  return (
    <ListItem {...itemProps} disablePadding sx={{ py: 0.8 }}>
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <ZUIAvatar orgId={orgId} personId={person.id} size="md" />
        <Typography component="span">
          {`${person.first_name} ${person.last_name}`}
        </Typography>
      </Box>
    </ListItem>
  );
};
