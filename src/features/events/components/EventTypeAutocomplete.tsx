import AddIcon from '@mui/icons-material/Add';
import Fuse from 'fuse.js';
import { lighten } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import {
  Autocomplete,
  IconButton,
  TextField,
  Theme,
  Tooltip,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

import EventTypesModel from '../models/EventTypesModel';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinActivity, ZetkinEvent } from 'utils/types/zetkin';

interface StyleProps {
  showBorder: boolean | undefined;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  create: {
    display: 'contents',
    fontSize: '1em',
    margin: 0,
    paddingLeft: 0,
  },
  inputRoot: {
    '& fieldset': { border: 'none' },
    '&:focus, &:hover': {
      borderColor: lighten(theme.palette.primary.main, 0.65),
      paddingLeft: 10,
      paddingRight: 0,
    },
    border: '2px dotted transparent',
    borderColor: ({ showBorder }) =>
      showBorder ? lighten(theme.palette.primary.main, 0.65) : '',
    borderRadius: 10,
    maxWidth: '200px',
    paddingLeft: ({ showBorder }) => (showBorder ? 10 : 0),
    transition: 'all 0.2s ease',
  },
}));

type EventTypeAutocompleteProps = {
  onBlur: () => void;
  onChange: (newValue: ZetkinEvent['activity'] | null) => void;
  onChangeNewOption: (newId: number) => void;
  onFocus: () => void;
  showBorder?: boolean;
  types: ZetkinActivity[];
  typesModel: EventTypesModel;
  value: ZetkinEvent['activity'];
};

interface NewEventType {
  id?: number;
  title: string | null;
  createType?: boolean;
}

const EventTypeAutocomplete: FC<EventTypeAutocompleteProps> = ({
  onBlur,
  onChange,
  onChangeNewOption,
  onFocus,
  showBorder,
  types,
  typesModel,
  value,
}) => {
  const [createdType, setCreatedType] = useState<string>('');

  const classes = useStyles({ showBorder });
  const messages = useMessages(messageIds);

  useEffect(() => {
    //When a user creates a new type, it is missing an event ID.
    //In here, when the length of the type changes,
    //it searches for the created event and updates event with an ID.
    if (createdType !== '') {
      const newId = types.find((item) => item.title === createdType)!.id;
      onChangeNewOption(newId);
    }
  }, [types.length]);

  if (value?.title === null) {
    types = [
      { id: 0, info_text: '', title: messages.type.uncategorized() },
      ...types,
    ];
  }

  const eventTypes: NewEventType[] = types;
  const fuse = new Fuse(eventTypes, { keys: ['title'], threshold: 0.4 });

  return (
    <Tooltip arrow title={showBorder ? '' : messages.type.tooltip()}>
      <Autocomplete
        blurOnSelect
        classes={{
          root: classes.inputRoot,
        }}
        disableClearable
        filterOptions={(options, { inputValue }) => {
          const searchedResults = fuse.search(inputValue);
          const filtered: NewEventType[] = [];
          const inputStartWithCapital = inputValue
            ? `${inputValue[0].toUpperCase()}${inputValue.substring(
                1,
                inputValue.length
              )}`
            : '';

          searchedResults.map((result) => {
            if (result.item.title !== null) {
              filtered.push({
                id: result.item.id,
                title: result.item.title,
              });
            }
          });
          //when user's type already exists
          if (
            filtered.filter(
              (item) =>
                item.title?.toLocaleLowerCase() ===
                inputValue.toLocaleLowerCase()
            ).length
          ) {
            return filtered;
          }

          filtered.push({
            createType: true,
            title: inputStartWithCapital,
          });

          return inputValue ? filtered : options;
        }}
        fullWidth
        getOptionLabel={(option) => option.title!}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        onBlur={() => onBlur()}
        onChange={(_, value) => {
          if (value.createType) {
            typesModel.addType(value.title!);
            setCreatedType(value.title!);
          }

          onChange({
            id: value.id!,
            title: value.title!,
          });
        }}
        onFocus={() => onFocus()}
        options={eventTypes}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              shrink: false,
              style: {
                maxWidth: 180,
              },
            }}
            InputProps={{
              ...params.InputProps,
            }}
            size="small"
          />
        )}
        renderOption={(props, option) => {
          if (option.createType) {
            return (
              <li {...props} key={option.id}>
                <IconButton className={classes.create}>
                  <AddIcon />
                  {messages.type.createType({ type: option.title! })}
                </IconButton>
              </li>
            );
          }
          return (
            <li {...props} key={option.id}>
              {option.title}
            </li>
          );
        }}
        value={value?.title ? value : { title: messages.type.uncategorized() }}
      />
    </Tooltip>
  );
};

export default EventTypeAutocomplete;
