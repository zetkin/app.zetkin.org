import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  ClickAwayListener,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

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
  onUseLocation: () => void;
  location: ZetkinLocation;
}

const LocationDetailsCard: FC<LocationDetailsCardProps> = ({
  model,
  onClose,
  onUseLocation,
  location,
}) => {
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState(location.title);
  const [fieldEditing, setFieldEditing] = useState<
    'title' | 'description' | null
  >(null);

  useEffect(() => {
    setTitle(location.title);
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
          if (fieldEditing) {
            setFieldEditing(null);
            model.setLocationTitle(location.id, title);
          }
        }}
      >
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
                return <Typography component="h5">{location.title}</Typography>;
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
      </ClickAwayListener>
      {location.info_text && (
        <Box display="flex" flex={1} flexDirection="column" paddingTop={1}>
          <Typography color="secondary">{location.info_text}</Typography>
        </Box>
      )}
      <Box display="flex" justifyContent="flex-end" paddingTop={2}>
        <Button onClick={onUseLocation} variant="contained">
          {messages.locationModal.useLocation()}
        </Button>
      </Box>
    </Box>
  );
};

export default LocationDetailsCard;
