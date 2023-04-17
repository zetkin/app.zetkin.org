import { FC, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Fuse from 'fuse.js';
import { lighten } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useState } from 'react';
import {
  Autocomplete,
  Box,
  ClickAwayListener,
  IconButton,
  TextField,
  Theme,
  Tooltip,
} from '@mui/material';

import { ZetkinActivity, ZetkinEvent } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import EventTypesModel from '../models/EventTypesModel';
import EventDataModel from '../models/EventDataModel';

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
    width: '18vw',
  },
}));

type EventTypeAutocompleteProps = {
  onBlur: (value: NewEventType) => void;
  onChange: (newValue: ZetkinEvent['activity'] | null) => void;
  onFocus: () => void;
  showBorder?: boolean;
  model: EventDataModel;
  types: ZetkinActivity[];
  typesModel: EventTypesModel;
  value: ZetkinEvent['activity'];
};

interface NewEventType {
  id?: number;
  title: string | null;
  //   info_text?: string | null;
  createType?: boolean;
}

const EventTypeAutocomplete: FC<EventTypeAutocompleteProps> = ({
  onBlur,
  onChange,
  onFocus,
  showBorder,
  types,
  model,
  typesModel,
  value,
}) => {
  const [userType, setUserType] = useState<NewEventType>(value);
  const classes = useStyles({ showBorder });
  const messages = useMessages(messageIds);

  if (value.title === null) {
    types = [
      { id: 0, info_text: '', title: messages.type.uncategorized() },
      ...types,
    ];
  }

  const eventTypes: NewEventType[] = types;
  const fuse = new Fuse(eventTypes, { keys: ['title'], threshold: 0.4 });

  return (
    <Autocomplete
      classes={{
        root: classes.inputRoot,
      }}
      disableClearable
      disablePortal
      filterOptions={(options, { inputValue }) => {
        const searchedResults = fuse.search(inputValue);
        const output: NewEventType[] = [];
        const inputStartWithCapital = inputValue
          ? `${inputValue[0].toUpperCase()}${inputValue.substring(
              1,
              inputValue.length
            )}`
          : '';

        searchedResults.map((result) => {
          if (result.item.title !== null) {
            output.push({
              id: result.item.id,
              //   info_text: result.item.info_text || null,
              title: result.item.title,
            });
          }
        });
        //when user's type already exists
        if (
          output.filter(
            (item) =>
              item.title?.toLocaleLowerCase() === inputValue.toLocaleLowerCase()
          ).length
        ) {
          return output;
        }

        output.push({
          createType: true,
          title: inputStartWithCapital,
        });
        return inputValue ? output : options;
      }}
      getOptionLabel={(option) => option.title!}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      onBlur={() => {
        //TO DO: send title null as well here
        if (userType.title) {
          onBlur(userType);
        }
      }}
      onChange={(_, value) => {
        if (value.createType) {
          typesModel.addType(0, value.title!);
        }
        //to set title to value when user create a type.
        setUserType({
          id: value.id,
          title: value.title,
        });
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
      value={
        userType.title ? userType : { title: messages.type.uncategorized() }
      }
    />
  );
};

export default EventTypeAutocomplete;
