import { makeStyles } from '@mui/styles';
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { Close, EventOutlined, OpenWith } from '@mui/icons-material';
import { FC, useCallback, useEffect, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import RelatedEventCard from '../RelatedEvent';
import useEventLocationMutations from 'features/events/hooks/useEventLocationMutations';
import { useMessages } from 'core/i18n';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';
import ZUIPreviewableInput, {
  ZUIPreviewableMode,
} from 'zui/ZUIPreviewableInput';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.grey[400],
    fontSize: '8rem',
  },
}));

interface LocationDetailsCardProps {
  onClose: () => void;
  onMove: () => void;
  onUseLocation: () => void;
  orgId: number;
  location: ZetkinLocation;
  relatedEvents: ZetkinEvent[];
}

const LocationDetailsCard: FC<LocationDetailsCardProps> = ({
  location,
  onClose,
  onMove,
  onUseLocation,
  orgId,
  relatedEvents,
}) => {
  const classes = useStyles();
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState(location.title);
  const [description, setDescription] = useState(location.info_text);
  const [fieldEditing, setFieldEditing] = useState<
    'title' | 'description' | null
  >(null);
  const { setLocationDescription, setLocationTitle } =
    useEventLocationMutations(orgId);

  const handleDescriptionTextAreaRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (el) {
        // When entering edit mode for desciption, focus the text area and put
        // caret at the end of the text
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
        el.scrollTop = el.scrollHeight;
      }
    },
    []
  );

  useEffect(() => {
    setTitle(location.title);
    setDescription(location.info_text);
  }, [location]);

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={() => {
          if (fieldEditing === 'title') {
            setFieldEditing(null);
            setLocationTitle(location.id, title);
          } else if (fieldEditing === 'description') {
            setFieldEditing(null);
            setLocationDescription(location.id, description);
          }
        }}
      >
        <Box padding={2}>
          <Box display="flex" justifyContent="space-between">
            <ZUIPreviewableInput
              mode={
                fieldEditing === 'title'
                  ? ZUIPreviewableMode.EDITABLE
                  : ZUIPreviewableMode.PREVIEW
              }
              onSwitchMode={(mode) => {
                setFieldEditing(
                  mode === ZUIPreviewableMode.EDITABLE ? 'title' : null
                );
              }}
              renderInput={(props) => (
                <TextField
                  fullWidth
                  inputProps={props}
                  onChange={(ev) => setTitle(ev.target.value)}
                  sx={{ marginBottom: 2 }}
                  value={title}
                />
              )}
              {...(location.title !== '' && {
                renderPreview: () => (
                  <Typography variant="h5">{location.title}</Typography>
                ),
              })}
              value={location.title}
            />
            <Close
              color="secondary"
              onClick={() => {
                onClose();
              }}
              sx={{
                cursor: 'pointer',
              }}
            />
          </Box>
          <ZUIPreviewableInput
            mode={
              fieldEditing === 'description'
                ? ZUIPreviewableMode.EDITABLE
                : ZUIPreviewableMode.PREVIEW
            }
            onSwitchMode={(mode) => {
              setFieldEditing(
                mode === ZUIPreviewableMode.EDITABLE ? 'description' : null
              );
            }}
            renderInput={(props) => (
              <TextField
                fullWidth
                inputProps={props}
                inputRef={handleDescriptionTextAreaRef}
                maxRows={4}
                multiline
                onChange={(ev) => setDescription(ev.target.value)}
                sx={{ marginTop: 2 }}
                value={description}
              />
            )}
            renderPreview={() => (
              <Box paddingTop={1}>
                <Typography
                  color="secondary"
                  fontStyle={
                    location.info_text.trim().length ? 'inherit' : 'italic'
                  }
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {location.info_text.trim().length
                    ? location.info_text
                    : messages.locationModal.noDescription()}
                </Typography>
              </Box>
            )}
            value={location.info_text}
          />
        </Box>
      </ClickAwayListener>
      <Divider />
      <Typography fontWeight="bold" padding={2} variant="h5">
        {messages.locationModal.relatedEvents()}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        paddingBottom={2}
        paddingX={2}
        sx={{ overflowY: 'auto' }}
      >
        {relatedEvents.length > 0 &&
          relatedEvents.map((event, index) => (
            <Box key={event.id} paddingTop={index === 0 ? '' : 2}>
              <RelatedEventCard event={event} />
              <Divider sx={{ paddingTop: 2 }} />
            </Box>
          ))}
        {!relatedEvents.length && (
          <Box
            alignItems="center"
            display="flex"
            flex={1}
            flexDirection="column"
            height="100"
            justifyContent="center"
          >
            <EventOutlined className={classes.icon} />
            <Typography color="secondary">
              {messages.locationModal.noRelatedEvents()}
            </Typography>
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="space-between" padding={2}>
        <Button onClick={onMove} startIcon={<OpenWith />}>
          {messages.locationModal.move()}
        </Button>
        <Button onClick={onUseLocation} variant="contained">
          {messages.locationModal.useLocation()}
        </Button>
      </Box>
    </Box>
  );
};

export default LocationDetailsCard;
