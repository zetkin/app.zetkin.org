import EventTypesModel from 'features/events/models/EventTypesModel';
import Fuse from 'fuse.js';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { Add, Clear } from '@mui/icons-material';
import { Autocomplete, Box, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { ZetkinActivity, ZetkinEvent } from 'utils/types/zetkin';

type EventModalTypeAutocompleteProps = {
  label?: string;
  onChange: (newValue: ZetkinEvent['activity'] | null) => void;
  onChangeNewOption: (newId: number) => void;
  types: ZetkinActivity[];
  typesModel: EventTypesModel;
  value: ZetkinEvent['activity'] | null;
};

interface EventTypeOption {
  id: number | 'CREATE' | 'UNCATEGORIZED';
  title: string;
}

const EventModalTypeAutocomplete: FC<EventModalTypeAutocompleteProps> = ({
  label,
  onChange,
  onChangeNewOption,
  types,
  typesModel,
  value,
}) => {
  const [createdType, setCreatedType] = useState<string>('');

  const messages = useMessages(messageIds);

  useEffect(() => {
    //When a user creates a new type, it is missing an event ID.
    //In here, when the length of the type changes,
    //it searches for the created event and updates event with an ID.
    if (createdType !== '') {
      const newId = types.find((item) => item.title === createdType)!.id;
      onChangeNewOption(newId!);
    }
  }, [types.length]);

  const allTypes: EventTypeOption[] = [
    ...types,
    {
      id: 'UNCATEGORIZED',
      title: messages.type.uncategorized(),
    },
  ];

  const fuse = new Fuse(types, {
    keys: ['title'],
    threshold: 0.4,
  });

  return (
    <Autocomplete
      disableClearable
      filterOptions={(options, { inputValue }) => {
        const searchedResults = fuse.search(inputValue);
        const inputStartWithCapital = inputValue
          ? `${inputValue[0].toUpperCase()}${inputValue.substring(
              1,
              inputValue.length
            )}`
          : '';

        const filteredResult: EventTypeOption[] = [
          ...searchedResults.map((result) => {
            return { id: result.item.id, title: result.item.title };
          }),
          {
            id: 'UNCATEGORIZED',
            title: messages.type.uncategorized(),
          },
        ];
        if (
          filteredResult.find(
            (item) =>
              item.title?.toLocaleLowerCase() === inputValue.toLocaleLowerCase()
          )
        ) {
          return filteredResult;
        }

        filteredResult.push({
          id: 'CREATE',
          title: inputStartWithCapital,
        });
        return inputValue ? filteredResult : options;
      }}
      fullWidth
      getOptionLabel={(option) => option.title!}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      onChange={(_, value) => {
        if (value.id == 'CREATE') {
          typesModel.addType(value.title!);
          setCreatedType(value.title!);
          return;
        }
        onChange(
          value.id == 'UNCATEGORIZED'
            ? null
            : {
                id: value.id,
                title: value.title!,
              }
        );
      }}
      options={allTypes}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{
            shrink: true,
            style: {
              maxWidth: 180,
            },
          }}
          InputProps={{
            ...params.InputProps,
          }}
          label={label}
          size="medium"
        />
      )}
      renderOption={(props, option) => {
        return (
          <Box key={option.id}>
            {option.id != 'CREATE' && option.id != 'UNCATEGORIZED' && (
              <li {...props}>{option.title}</li>
            )}
            {option.id == 'UNCATEGORIZED' && (
              <li {...props}>
                <Clear />
                {messages.type.uncategorized()}
              </li>
            )}
            {option.id == 'CREATE' && (
              <li {...props}>
                <Add />
                {messages.type.createType({ type: option.title! })}
              </li>
            )}
          </Box>
        );
      }}
      value={
        value
          ? value
          : {
              id: 'UNCATEGORIZED',
              title: messages.type.uncategorized(),
            }
      }
    />
  );
};

export default EventModalTypeAutocomplete;
