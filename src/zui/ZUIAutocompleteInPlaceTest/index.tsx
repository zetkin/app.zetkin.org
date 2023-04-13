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
  Tooltip,
} from '@mui/material';

import EventTypesModel from 'features/events/models/EventTypesModel';
import messageIds from 'features/events/l10n/messageIds';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import { ZetkinActivity } from 'utils/types/zetkin';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';

const useStyles = makeStyles((theme) => ({
  create: {
    display: 'contents',
    fontSize: '1em',
    margin: 0,
    paddingLeft: 0,
  },
  inputRoot: {
    '& fieldset': { border: 'none' },
    border: '2px dotted transparent',
    borderColor: lighten(theme.palette.primary.main, 0.65),
    borderRadius: 10,
    maxWidth: '200px',
    overflow: 'hidden',
    paddingLeft: 10,
    paddingRight: 0,
    textOverflow: 'ellipsis',
    width: '18vw',
  },
  preview: {
    // Same styles as input
    '& fieldset': { border: 'none' },
    '&:focus, &:hover': {
      borderColor: lighten(theme.palette.primary.main, 0.65),
      paddingLeft: 10,
      paddingRight: 0,
    },
    border: '2px dotted transparent',
    borderRadius: 10,
    maxWidth: '200px',
    transition: 'all 0.2s ease',
    width: '18vw',
  },
  showBorder: {
    '& fieldset': { border: 'none' },
    border: '2px dotted transparent',
    borderColor: lighten(theme.palette.primary.main, 0.65),
    borderRadius: 10,
    maxWidth: '200px',
    paddingLeft: 10,
    paddingRight: 0,
    transition: 'all 0.2s ease',
    width: '18vw',
  },
}));

interface NewEventType {
  id?: number;
  title: string | null;
  info_text?: string | null;
  createType?: boolean;
}

interface ZUIAutocompleteInPlaceTestProps {
  currentType: NewEventType;
  onTypeChange: (value: string) => void;
  types: ZetkinActivity[];
  typesModel: EventTypesModel;
  showBorder: boolean;
  setAutoOnEdit: (value: boolean) => void;
  setShowBorder: (value: boolean) => void;
}

const ZUIAutocompleteInPlaceTest = ({
  types,
  currentType,
  onTypeChange,
  typesModel,
  setAutoOnEdit,
  setShowBorder,
  showBorder,
}: ZUIAutocompleteInPlaceTestProps) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [eventType, setEventType] = useState<NewEventType>(currentType);
  const messages = useMessages(messageIds);

  if (currentType === null) {
    types = [
      { id: 0, info_text: '', title: messages.type.uncategorized() },
      ...types,
    ];
  }
  const eventTypes: NewEventType[] = types;

  const classes = useStyles();
  const fuse = new Fuse(eventTypes, { keys: ['title'], threshold: 0.4 });

  const { clickAwayProps, previewableProps } = useEditPreviewBlock({
    editable: editing,
    onEditModeEnter: () => {
      setEditing(true);
      setShowBorder(true);
    },
    onEditModeExit: () => {
      setEditing(false);
      setShowBorder(false);
      setAutoOnEdit(false);
    },
    save: () => {
      if (!eventType.id) {
        const typesAfterCreateType = typesModel.getTypes();
        const newId = typesAfterCreateType.data!.find(
          (item) => item.title === eventType.title
        )!.id;
        typesModel.setType(newId);
      }
      if (eventType.id) {
        typesModel.setType(eventType.id!);
      }
      onTypeChange('');
    },
  });

  return (
    <ClickAwayListener {...clickAwayProps}>
      <Box>
        <ZUIPreviewableInput
          {...previewableProps}
          renderInput={() => (
            //tooltip here to prevent blinking after click the event type text
            <Tooltip arrow title={''}>
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
                  //placeholder to title
                  onTypeChange(inputStartWithCapital);

                  searchedResults.map((result) => {
                    if (result.item.title !== null) {
                      output.push({
                        id: result.item.id,
                        info_text: result.item.info_text || null,
                        title: result.item.title,
                      });
                    }
                  });
                  //when user's type already exists
                  if (
                    output.filter(
                      (item) =>
                        item.title?.toLocaleLowerCase() ===
                        inputValue.toLocaleLowerCase()
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
                id="type-autocomplete"
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                onChange={(e, newValue) => {
                  if (newValue.createType) {
                    typesModel.addType(0, newValue.title!);
                  }
                  //placeholder to title
                  onTypeChange(newValue.title!);
                  setEventType(
                    {
                      id: newValue.id,
                      title: newValue.title,
                    } || currentType
                  );
                }}
                options={eventTypes}
                readOnly={!editing}
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
                  eventType.title
                    ? eventType
                    : { title: messages.type.uncategorized() }
                }
              />
            </Tooltip>
          )}
          renderPreview={() => {
            return (
              <Tooltip arrow title={messages.type.tooltip()}>
                <Autocomplete
                  classes={{
                    root: showBorder ? classes.showBorder : classes.preview,
                  }}
                  freeSolo
                  fullWidth
                  id="auto-preview"
                  onFocus={() => setAutoOnEdit(true)}
                  options={[]}
                  readOnly={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{
                        style: {
                          maxWidth: 180,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      }}
                    />
                  )}
                  value={eventType.title || messages.type.uncategorized()}
                />
              </Tooltip>
            );
          }}
          value={''}
        />
      </Box>
    </ClickAwayListener>
  );
};
export default ZUIAutocompleteInPlaceTest;
