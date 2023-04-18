import {
  Box,
  Button,
  ClickAwayListener,
  TextField,
  Typography,
} from '@mui/material';
import { Close, OpenWith } from '@mui/icons-material';
import { FC, useCallback, useEffect, useState } from 'react';

import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import ZUIPreviewableInput, {
  ZUIPreviewableMode,
} from 'zui/ZUIPreviewableInput';

interface LocationDetailsCardProps {
  model: LocationsModel;
  onClose: () => void;
  onMove: () => void;
  onUseLocation: () => void;
  location: ZetkinLocation;
}

const LocationDetailsCard: FC<LocationDetailsCardProps> = ({
  model,
  onClose,
  onMove,
  onUseLocation,
  location,
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
      padding={2}
      sx={{
        backgroundColor: 'white',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
        <Box>
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
                  fontStyle={location.info_text ? 'inherit' : 'italic'}
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {location.info_text
                    ? location.info_text
                    : messages.locationModal.noDescription()}
                </Typography>
              </Box>
            )}
            value={location.title}
          />
        </Box>
      </ClickAwayListener>
      <Box display="flex" justifyContent="space-between" paddingTop={2}>
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
