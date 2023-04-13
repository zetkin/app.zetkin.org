import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  ClickAwayListener,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import LocationsModel from 'features/events/models/LocationsModel';
import messageIds from 'features/events/l10n/messageIds';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';

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
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(location.title);
  const [description, setDescription] = useState(location.info_text);

  const { clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter: () => setEditable(true),
      onEditModeExit: () => setEditable(false),
      save: () => {
        model.updateLocationData(location.id, {
          info_text: description,
          title: title,
        });
      },
    });

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
      <ClickAwayListener {...clickAwayProps}>
        <Box {...containerProps}>
          <Box display="flex" justifyContent="space-between">
            <ZUIPreviewableInput
              {...previewableProps}
              renderInput={(props) => (
                <TextField
                  fullWidth
                  inputProps={props}
                  label={messages.locationModal.title()}
                  onChange={(ev) => setTitle(ev.target.value)}
                  sx={{ marginBottom: 2 }}
                  value={title}
                />
              )}
              renderPreview={() => {
                if (location.title !== '') {
                  return (
                    <Typography component="h5">{location.title}</Typography>
                  );
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
          {location.info_text && (
            <Box display="flex" flex={1} flexDirection="column" paddingTop={1}>
              <ZUIPreviewableInput
                {...previewableProps}
                renderInput={(props) => (
                  <TextField
                    fullWidth
                    inputProps={props}
                    label={messages.locationModal.description()}
                    multiline
                    onChange={(ev) => setDescription(ev.target.value)}
                    rows={4}
                    sx={{ marginBottom: 2 }}
                    value={description}
                  />
                )}
                renderPreview={() => {
                  if (location.title !== '') {
                    return (
                      <Typography color="secondary">
                        {location.info_text}
                      </Typography>
                    );
                  } else {
                    return <></>;
                  }
                }}
                value={location.title}
              />
            </Box>
          )}
        </Box>
      </ClickAwayListener>
      <Box display="flex" justifyContent="flex-end" paddingTop={2}>
        <Button onClick={onUseLocation} variant="contained">
          {messages.locationModal.useLocation()}
        </Button>
      </Box>
    </Box>
  );
};

export default LocationDetailsCard;
