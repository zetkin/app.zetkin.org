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

import EventDataModel from 'features/events/models/EventDataModel';
import EventTypesModel from 'features/events/models/EventTypesModel';
import messageIds from 'features/events/l10n/messageIds';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import { ZetkinActivity } from 'utils/types/zetkin';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';

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
    borderColor: ({ showBorder }) =>
      showBorder ? lighten(theme.palette.primary.main, 0.65) : '',
    borderRadius: 10,
    maxWidth: '200px',
    paddingLeft: ({ showBorder }) => (showBorder ? 10 : 0),
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
  onBorderToggle: (value: boolean) => void;
  onFocus: (value: boolean) => void;
  onTypeChange: (value: string) => void;
  types: ZetkinActivity[];
  typesModel: EventTypesModel;
  model: EventDataModel;
  showBorder: boolean;
}

const ZUIAutocompleteInPlaceTest = ({
  types,
  currentType,
  onTypeChange,
  typesModel,
  model,
  onFocus,
  onBorderToggle,
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

  const classes = useStyles({ showBorder });
  const fuse = new Fuse(eventTypes, { keys: ['title'], threshold: 0.4 });

  const { clickAwayProps, previewableProps } = useEditPreviewBlock({
    editable: editing,
    onEditModeEnter: () => {
      setEditing(true);
      onBorderToggle(true);
    },
    onEditModeExit: () => {
      setEditing(false);
      onBorderToggle(false);
      onFocus(false);
    },
    save: () => {
      if (!eventType.id) {
        const typesAfterCreateType = typesModel.getTypes();
        const newId = typesAfterCreateType.data!.find(
          (item) => item.title === eventType.title
        )!.id;
        model.setType(newId);
      }
      if (eventType.id) {
        model.setType(eventType.id!);
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
                    root: classes.preview,
                  }}
                  freeSolo
                  fullWidth
                  id="auto-preview"
                  onFocus={() => onFocus(true)}
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
                      size="small"
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
