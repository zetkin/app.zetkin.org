import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { FC } from 'react';
import { Pentagon, Place, SquareRounded } from '@mui/icons-material';

import { MapStyle } from './OrganizerMap';

type LayerSettingsProps = {
  mapStyle: MapStyle;
  onMapStyleChange: (newMapStyle: MapStyle) => void;
};

const LayerSettings: FC<LayerSettingsProps> = ({
  mapStyle,
  onMapStyleChange,
}) => {
  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flexDirection="column"
      gap={1}
      paddingTop={1}
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
            <Typography id="place-style-label">
              What the markers represent.
            </Typography>
          </Box>
          <Select
            fullWidth
            labelId="place-style-label"
            onChange={(ev) => {
              const newValue = ev.target.value;
              if (
                newValue == 'dot' ||
                newValue == 'households' ||
                newValue == 'progress' ||
                newValue == 'hide'
              ) {
                onMapStyleChange({ ...mapStyle, place: newValue });
              }
            }}
            value={mapStyle.place}
          >
            <MenuItem value="dot">Dot</MenuItem>
            <MenuItem value="households">
              Number of households at the location
            </MenuItem>
            <MenuItem value="progress">Progress in this assignment</MenuItem>
            <MenuItem value="hide">Hidden</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <Box display="flex" gap={1} paddingBottom={1}>
            <Pentagon color="secondary" />
            <Typography id="area-style-label">
              What the area color represents.
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
            <MenuItem value="assignees">If there are assignees</MenuItem>
            <MenuItem value="households">Number of households</MenuItem>
            <MenuItem value="progress">Progress in this assignment</MenuItem>
            <MenuItem value="outlined">Outlined</MenuItem>
            <MenuItem value="hide">Hidden</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <Box display="flex" gap={1} paddingBottom={1}>
            <SquareRounded color="secondary" />
            <Typography id="overlay-style-label">
              What to show in the center of the areas.
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
            <MenuItem value="assignees">Assignees</MenuItem>
            <MenuItem value="households">
              Number of places and households in the area
            </MenuItem>
            <MenuItem value="progress">
              Progress for the area in this assignment
            </MenuItem>
            <MenuItem value="hide">Hidden</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default LayerSettings;
