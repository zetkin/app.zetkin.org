import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { FC } from 'react';

import { MapStyle } from './OrganizerMap';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

type MapStyleSettingsProps = {
  mapStyle: MapStyle;
  onMapStyleChange: (newMapStyle: MapStyle) => void;
};

const MapStyleSettings: FC<MapStyleSettingsProps> = ({
  mapStyle,
  onMapStyleChange,
}) => {
  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flexDirection="column"
      gap={1}
      paddingRight={2}
      paddingTop={1}
      sx={{ overflowY: 'auto' }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        paddingTop={1}
        width="100%"
      >
        <FormControl component="fieldset" variant="outlined">
          <Box display="flex" gap={1} paddingBottom={1}>
            <Typography>
              <Msg id={messageIds.map.mapStyle.area.label} />
            </Typography>
          </Box>
          <RadioGroup
            onChange={(ev) => {
              const newValue = ev.target.value;
              if (newValue === 'assignees' || newValue === 'outlined') {
                onMapStyleChange({ ...mapStyle, area: newValue });
              }
            }}
            sx={{ ml: 1 }}
            value={mapStyle.area}
          >
            {[
              {
                label: messageIds.map.mapStyle.area.options.assignees,
                value: 'assignees',
              },
              {
                label: messageIds.map.mapStyle.area.options.outlined,
                value: 'outlined',
              },
            ].map(({ value, label }) => (
              <FormControlLabel
                key={value}
                control={<Radio />}
                label={<Msg id={label} />}
                value={value}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export default MapStyleSettings;
