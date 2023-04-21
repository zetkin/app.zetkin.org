import NextLink from 'next/link';
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Close, OpenWith } from '@mui/icons-material';
import { FC, useCallback, useEffect, useState } from 'react';

import { getParticipantsStatusColor } from 'features/events/utils/eventUtils';
import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUINumberChip from 'zui/ZUINumberChip';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';
import ZUIPreviewableInput, {
  ZUIPreviewableMode,
} from 'zui/ZUIPreviewableInput';

interface LocationDetailsCardProps {
  model: LocationsModel;
  onClose: () => void;
  onMove: () => void;
  onUseLocation: () => void;
  location: ZetkinLocation;
  relatedEvents: ZetkinEvent[];
}

const LocationDetailsCard: FC<LocationDetailsCardProps> = ({
  location,
  model,
  onClose,
  onMove,
  onUseLocation,
  relatedEvents,
}) => {
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState(location.title);
  const [description, setDescription] = useState(location.info_text);
  const [fieldEditing, setFieldEditing] = useState<
    'title' | 'description' | null
  >(null);

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
            model.setLocationTitle(location.id, title);
          } else if (fieldEditing === 'description') {
            setFieldEditing(null);
            model.setLocationDescription(location.id, description);
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
              renderPreview={() => {
                if (location.title !== '') {
                  return <Typography variant="h5">{location.title}</Typography>;
                } else {
                  return <></>;
                }
              }}
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
      <Box height="100%" overflow="scroll" padding={2}>
        <Typography fontWeight="bold" variant="h5">
          {messages.locationModal.relatedEvents()}
        </Typography>
        <Box>
          {relatedEvents.length > 0 &&
            relatedEvents.map((event) => (
              <>
                <Box
                  key={event.id}
                  display="flex"
                  flexDirection="column"
                  paddingY={2}
                >
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <NextLink
                      href={`/organize/${event.organization.id}/${
                        event.campaign
                          ? `project/${event.campaign.id}`
                          : 'standalone'
                      }/events/${event.id}`}
                      passHref
                    >
                      <Link>
                        <Typography>
                          {event.title || event.activity.title}
                        </Typography>
                      </Link>
                    </NextLink>
                    <ZUINumberChip
                      color={getParticipantsStatusColor(
                        event.num_participants_required,
                        event.num_participants_available
                      )}
                      outlined={true}
                      size="sm"
                      value={`${event.num_participants_available}/${event.num_participants_required}`}
                    />
                  </Box>
                  <Typography color="secondary">
                    <ZUITimeSpan
                      end={new Date(event.end_time)}
                      start={new Date(event.start_time)}
                    />
                  </Typography>
                </Box>
                <Divider />
              </>
            ))}
        </Box>
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
