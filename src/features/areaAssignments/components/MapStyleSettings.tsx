import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { FC } from 'react';
import { Pentagon, Place, SquareRounded } from '@mui/icons-material';

import { MapStyle } from './OrganizerMap';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

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
        <FormControl variant="outlined">
          <Box display="flex" gap={1} paddingBottom={1}>
            <Place color="secondary" />
            <Typography id="location-style-label">
              <Msg id={messageIds.map.mapStyle.markers.label} />
            </Typography>
          </Box>
          <Select
            fullWidth
            labelId="location-style-label"
            onChange={(ev) => {
              const newValue = ev.target.value;
              if (
                newValue == 'dot' ||
                newValue == 'households' ||
                newValue == 'progress' ||
                newValue == 'hide'
              ) {
                onMapStyleChange({ ...mapStyle, location: newValue });
              }
            }}
            value={mapStyle.location}
          >
            <MenuItem value="dot">
              <Msg id={messageIds.map.mapStyle.markers.options.dot} />
            </MenuItem>
            <MenuItem value="households">
              <Msg id={messageIds.map.mapStyle.markers.options.households} />
            </MenuItem>
            <MenuItem value="progress">
              <Msg id={messageIds.map.mapStyle.markers.options.progress} />
            </MenuItem>
            <MenuItem value="hide">
              <Msg id={messageIds.map.mapStyle.markers.options.hidden} />
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <Box display="flex" gap={1} paddingBottom={1}>
            <Pentagon color="secondary" />
            <Typography id="area-style-label">
              <Msg id={messageIds.map.mapStyle.area.label} />
            </Typography>
          </Box>
          <Select
            fullWidth
            labelId="area-style-color"
            onChange={(ev) => {
              const newValue = ev.target.value;
              if (
                newValue == 'households' ||
                newValue == 'progress' ||
                newValue == 'hide' ||
                newValue == 'assignees' ||
                newValue == 'outlined'
              ) {
                onMapStyleChange({ ...mapStyle, area: newValue });
              }
            }}
            value={mapStyle.area}
          >
            <MenuItem value="assignees">
              <Msg id={messageIds.map.mapStyle.area.options.assignees} />
            </MenuItem>
            <MenuItem value="households">
              <Msg id={messageIds.map.mapStyle.area.options.households} />
            </MenuItem>
            <MenuItem value="progress">
              <Msg id={messageIds.map.mapStyle.area.options.progress} />
            </MenuItem>
            <MenuItem value="outlined">
              <Msg id={messageIds.map.mapStyle.area.options.outlined} />
            </MenuItem>
            <MenuItem value="hide">
              <Msg id={messageIds.map.mapStyle.area.options.hidden} />
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <Box display="flex" gap={1} paddingBottom={1}>
            <SquareRounded color="secondary" />
            <Typography id="overlay-style-label">
              <Msg id={messageIds.map.mapStyle.center.label} />
            </Typography>
          </Box>
          <Select
            fullWidth
            labelId="overlay-style-label"
            onChange={(ev) => {
              const newValue = ev.target.value;
              if (
                newValue == 'assignees' ||
                newValue == 'households' ||
                newValue == 'progress' ||
                newValue == 'hide'
              ) {
                onMapStyleChange({ ...mapStyle, overlay: newValue });
              }
            }}
            value={mapStyle.overlay}
          >
            <MenuItem value="assignees">
              <Msg id={messageIds.map.mapStyle.center.options.assignees} />
            </MenuItem>
            <MenuItem value="households">
              <Msg id={messageIds.map.mapStyle.center.options.households} />
            </MenuItem>
            <MenuItem value="progress">
              <Msg id={messageIds.map.mapStyle.center.options.progress} />
            </MenuItem>
            <MenuItem value="hide">
              <Msg id={messageIds.map.mapStyle.center.options.hidden} />
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default MapStyleSettings;
