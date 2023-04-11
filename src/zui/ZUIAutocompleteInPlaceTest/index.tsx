import Fuse from 'fuse.js';
import { lighten } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import {
  Autocomplete,
  Box,
  ClickAwayListener,
  TextField,
  Tooltip,
} from '@mui/material';
import { useMemo, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import { ZetkinActivity } from 'utils/types/zetkin';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';

const useStyles = makeStyles((theme) => ({
  input: {
    height: '30px',
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
}));

interface NewEventType {
  id: number;
  title: string | null;
  info_text?: string | null;
}
interface ZUIAutocompleteInPlaceTestProps {
  types: ZetkinActivity[];
  currentType: NewEventType;
}
type EventOptions = ZetkinActivity | NewEventType;

const ZUIAutocompleteInPlaceTest = ({
  types,
  currentType,
}: ZUIAutocompleteInPlaceTestProps) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [eventType, setEventType] = useState<NewEventType>(currentType);
  const messages = useMessages(messageIds);

  const eventTypes = useMemo(() => {
    const eTypes: NewEventType[] = [];

    if (currentType.title === null) {
      eTypes.unshift({
        id: 0,
        title: messages.type.uncategorized(),
      });
    }
    types.map((item) => eTypes.push(item));
    return eTypes;
  }, [types]);

  const classes = useStyles();
  const fuse = new Fuse(eventTypes, { keys: ['title'], threshold: 0.4 });

  const { clickAwayProps, previewableProps } = useEditPreviewBlock({
    editable: editing,
    onEditModeEnter: () => setEditing(true),
    onEditModeExit: () => setEditing(false),
    save: () => {
      return <></>;
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
                  const output: ZetkinActivity[] = [];

                  searchedResults.map((result) => {
                    if (result.item.title !== null) {
                      output.push({
                        id: result.item.id,
                        info_text: result.item.info_text || null,
                        title: result.item.title,
                      });
                    }
                  });

                  return inputValue ? output : options;
                }}
                getOptionLabel={(option) => option.title!}
                id="type-autocomplete"
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                onChange={(e, newValue) => {
                  setEventType(
                    {
                      id: newValue.id,
                      title: newValue.title,
                    } || currentType
                  );
                }}
                onFocus={() => setEditing(true)}
                options={(eventTypes as EventOptions[]) || []}
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
                // PaperComponent={({ children }) => {
                //   return (
                //     <Paper sx={{ fontWeight: 400 }}>
                //       {children}

                //       <IconButton>
                //         {messages.type.createType({ type: 'hello' })}
                //       </IconButton>
                //     </Paper>
                //   );
                // }}
                value={
                  eventType.title
                    ? eventType
                    : { id: 0, title: messages.type.uncategorized() }
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
