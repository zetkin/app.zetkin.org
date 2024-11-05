import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { FC, useRef } from 'react';
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
  const customSettingsRef = useRef<MapStyle>({
    area: 'hide',
    overlay: 'hide',
    place: 'hide',
  });

  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flexDirection="column"
      gap={1}
      paddingTop={1}
    >
      Select what info you see on the map.
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        paddingTop={1}
        width="100%"
      >
        <Box display="flex" gap={1}>
          <Place color="secondary" />
          <Typography variant="body2">
            How to display the markers that represent locations on your map
          </Typography>
        </Box>
        <FormControl variant="outlined">
          <InputLabel id="place-style-label">Location marker</InputLabel>
          <Select
            fullWidth
            label="Location marker"
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
                customSettingsRef.current = { ...mapStyle, place: newValue };
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
        <Box display="flex" gap={1}>
          <Pentagon color="secondary" />
          <Typography variant="body2">
            What the area color represents.
          </Typography>
        </Box>
        <FormControl variant="outlined">
          <InputLabel id="area-style-label">Area color</InputLabel>
          <Select
            fullWidth
            label="Area color"
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
                customSettingsRef.current = { ...mapStyle, area: newValue };
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
        <Box display="flex" gap={1}>
          <SquareRounded color="secondary" />
          <Typography variant="body2">
            What to show in the center of the areas.
          </Typography>
        </Box>
        <FormControl variant="outlined">
          <InputLabel id="overlay-style-label">Center of area</InputLabel>
          <Select
            fullWidth
            label="Center of area"
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
                customSettingsRef.current = {
                  ...mapStyle,
                  overlay: newValue,
                };
              }
            }}
            value={mapStyle.overlay}
          >
            <MenuItem value="assignees">Assignees</MenuItem>
            <MenuItem value="households">
              Number of households and places in the area
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
