import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FC } from 'react';

type LayerSettingsProps = {
  areaStyle: 'assignees' | 'households' | 'progress' | 'hide';
  onAreaStyleChange: (
    newValue: 'assignees' | 'households' | 'progress' | 'hide'
  ) => void;
  onOverlayStyleChange: (
    newValue: 'assignees' | 'households' | 'progress' | 'hide'
  ) => void;
  onPlaceStyleChange: (
    newValue: 'dot' | 'households' | 'progress' | 'hide'
  ) => void;
  overlayStyle: 'assignees' | 'households' | 'progress' | 'hide';
  placeStyle: 'dot' | 'households' | 'progress' | 'hide';
};

const LayerSettings: FC<LayerSettingsProps> = ({
  areaStyle,
  onAreaStyleChange,
  onOverlayStyleChange,
  onPlaceStyleChange,
  overlayStyle,
  placeStyle,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={2} paddingTop={1}>
      <FormControl variant="outlined">
        <InputLabel id="place-style-label">Place</InputLabel>
        <Select
          label="Place"
          labelId="place-style-label"
          onChange={(ev) => {
            const newValue = ev.target.value;
            if (
              newValue == 'dot' ||
              newValue == 'households' ||
              newValue == 'progress' ||
              newValue == 'hide'
            ) {
              onPlaceStyleChange(newValue);
            }
          }}
          sx={{ backgroundColor: 'white', width: '10rem' }}
          value={placeStyle}
        >
          <MenuItem value="dot">Dot</MenuItem>
          <MenuItem value="households">Number of households</MenuItem>
          <MenuItem value="progress">
            Progress (visited in this assignment)
          </MenuItem>
          <MenuItem value="hide">Hide</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel id="area-style-label">Area</InputLabel>
        <Select
          label="Area"
          labelId="area-style-color"
          onChange={(ev) => {
            const newValue = ev.target.value;
            if (
              newValue == 'households' ||
              newValue == 'progress' ||
              newValue == 'hide' ||
              newValue == 'assignees'
            ) {
              onAreaStyleChange(newValue);
            }
          }}
          sx={{ backgroundColor: 'white', width: '10rem' }}
          value={areaStyle}
        >
          <MenuItem value="default">Assignees</MenuItem>
          <MenuItem value="households">Number of households</MenuItem>
          <MenuItem value="progress">
            Progress (visited in this assignment)
          </MenuItem>
          <MenuItem value="hide">Hide</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel id="overlay-style-label">Overlay</InputLabel>
        <Select
          label="Overlay"
          labelId="overlay-style-label"
          onChange={(ev) => {
            const newValue = ev.target.value;
            if (
              newValue == 'assignees' ||
              newValue == 'households' ||
              newValue == 'progress' ||
              newValue == 'hide'
            ) {
              onOverlayStyleChange(newValue);
            }
          }}
          sx={{ backgroundColor: 'white', width: '10rem' }}
          value={overlayStyle}
        >
          <MenuItem value="assignees">Assignees</MenuItem>
          <MenuItem value="households">Number of households</MenuItem>
          <MenuItem value="progress">
            Progress (visited in this assignment)
          </MenuItem>
          <MenuItem value="hide">Hide</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LayerSettings;
