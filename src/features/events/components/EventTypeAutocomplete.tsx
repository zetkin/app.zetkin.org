import Fuse from 'fuse.js';
import { lighten } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Add, Clear, DeleteOutline } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Theme,
  Tooltip,
} from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import messageIds from '../l10n/messageIds';
import theme from 'theme';
import useCreateType from '../hooks/useCreateType';
import { useMessages } from 'core/i18n';
import useDeleteType from '../hooks/useDeleteType';
import { ZetkinActivity, ZetkinEvent } from 'utils/types/zetkin';

interface StyleProps {
  showBorder: boolean | undefined;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
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
    paddingLeft: ({ showBorder }) => (showBorder ? 10 : 0),
    paddingRight: ({ showBorder }) => (showBorder ? 0 : 10),
    transition: 'all 0.2s ease',
  },
  span: {
    // Same styles as input
    '&:focus, &:hover': {
      borderColor: lighten(theme.palette.primary.main, 0.65),
      paddingLeft: 10,
      paddingRight: 0,
    },
    border: '2px dotted transparent',
    borderRadius: 10,
    fontSize: '1rem',
    paddingRight: 10,
    // But invisible and positioned absolutely to not affect flow
    position: 'absolute',
    visibility: 'hidden',
  },
}));

type EventTypeAutocompleteProps = {
  onBlur: () => void;
  onChange: (newValue: ZetkinEvent['activity'] | null) => void;
  onChangeNewOption: (newId: number) => void;
  onFocus: () => void;
  orgId: number;
  showBorder?: boolean;
  types: ZetkinActivity[];
  value: ZetkinEvent['activity'];
};

interface EventTypeOption {
  id: number | 'CREATE' | 'UNCATEGORIZED';
  title: string;
}

const EventTypeAutocomplete: FC<EventTypeAutocompleteProps> = ({
  onBlur,
  onChange,
  onChangeNewOption,
  onFocus,
  orgId,
  showBorder,
  types,
  value,
}) => {
  const createType = useCreateType(orgId);
  const deleteType = useDeleteType(orgId);
  const messages = useMessages(messageIds);
  const uncategorizedMsg = messages.type.uncategorized();
  const [createdType, setCreatedType] = useState<string>('');
  const [text, setText] = useState<string>(value?.title ?? uncategorizedMsg);
  const [dropdownListWidth, setDropdownListWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<EventTypeOption>();

  const handleDialogOpen = (shouldOpen: boolean) => {
    setOpen(shouldOpen);
  };

  const spanRef = useRef<HTMLSpanElement>(null);
  const classes = useStyles({ showBorder });

  useEffect(() => {
    //When a user creates a new type, it is missing an event ID.
    //In here, when the length of the type changes,
    //it searches for the created event and updates event with an ID.
    if (createdType !== '') {
      const newEventType = types.find((item) => item.title === createdType);
      setText(newEventType ? newEventType!.title : uncategorizedMsg);
      if (newEventType) {
        onChangeNewOption(newEventType!.id);
      }
    }
  }, [types.length]);

  useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setDropdownListWidth(width);
    }
  }, [spanRef.current, text]);

  useEffect(() => {
    setText(value ? value.title : uncategorizedMsg);
  }, [value]);

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
    <>
      <Tooltip arrow title={showBorder ? '' : messages.type.tooltip()}>
        <Autocomplete
          blurOnSelect
          classes={{
            root: classes.inputRoot,
          }}
          componentsProps={{
            popper: {
              placement: 'bottom-start',
              style: { maxWidth: 380, minWidth: 180, width: dropdownListWidth },
            },
          }}
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
                title: uncategorizedMsg,
              },
            ];
            if (
              filteredResult.find(
                (item) =>
                  item.title?.toLocaleLowerCase() ===
                  inputValue.toLocaleLowerCase()
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
          getOptionLabel={(option) => option.title!}
          isOptionEqualToValue={(option, value) => option.title === value.title}
          onBlur={() => {
            // show 'uncategorized' in textField when blurring
            if (!value && text !== uncategorizedMsg) {
              setText(uncategorizedMsg);
            }
            //set text to previous input value when clicking away
            if (value && text !== value.title) {
              setText(value.title);
            }
            onBlur();
          }}
          onChange={(_, value) => {
            setText(value.title);
            if (value.id == 'CREATE') {
              createType(value.title!);
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
          onFocus={() => onFocus()}
          options={allTypes}
          renderInput={(params) => (
            <>
              <span ref={spanRef} className={classes.span}>
                {text}
              </span>
              <TextField
                {...params}
                InputLabelProps={{
                  shrink: false,
                }}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    maxWidth: 380,
                    minWidth: 60,
                    width: dropdownListWidth + 50,
                  },
                }}
                onChange={(e) => setText(e.target.value)}
                size="small"
              />
            </>
          )}
          renderOption={(props, option) => {
            return (
              <Box key={option.id}>
                {option.id != 'CREATE' && option.id != 'UNCATEGORIZED' && (
                  <li {...props} style={{ justifyContent: 'space-between' }}>
                    {option.title}
                    <DeleteOutline
                      onClick={() => {
                        handleDialogOpen(true), setType(option);
                      }}
                      sx={{
                        '&:hover': {
                          color: theme.palette.secondary.main,
                        },
                        color: theme.palette.secondary.light,
                        cursor: 'pointer',
                        transition: 'color 0.3s ease',
                      }}
                    />
                  </li>
                )}
                {option.id == 'UNCATEGORIZED' && (
                  <li {...props}>
                    <Clear />
                    {uncategorizedMsg}
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
                  title: text,
                }
          }
        />
      </Tooltip>
      {open && type && (
        <Dialog open={open}>
          <DialogContent>
            {messages.type.deleteMessage({ eventType: type.title })}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogOpen(false)} variant="outlined">
              {messages.type.cancelButton()}
            </Button>
            <Button
              onClick={() => {
                if (typeof type.id === 'number') {
                  deleteType(type.id);
                }
                handleDialogOpen(false);
              }}
              variant="contained"
            >
              {messages.type.deleteButton()}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default EventTypeAutocomplete;
