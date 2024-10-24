import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

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
  const [showCustomControls, setShowCustomControls] = useState(false);

  return (
    <Box alignItems="flex-start" display="flex" flexDirection="column" gap={1}>
      Pick a style for your map layers
      <Box
        border={1}
        onClick={() => {
          onOverlayStyleChange('households');
          onAreaStyleChange('households');
          onPlaceStyleChange('households');
        }}
        padding={1}
        sx={{ cursor: 'pointer' }}
      >
        <Typography>Number of households</Typography>
      </Box>
      <Box
        border={1}
        onClick={() => {
          onOverlayStyleChange('assignees');
          onAreaStyleChange('progress');
          onPlaceStyleChange('progress');
        }}
        padding={1}
        sx={{ cursor: 'pointer' }}
      >
        <Typography>Canvasser progress</Typography>
      </Box>
      <Box
        border={1}
        onClick={() => setShowCustomControls(true)}
        padding={1}
        sx={{ cursor: 'pointer' }}
      >
        <Typography>Custom</Typography>
      </Box>
      {showCustomControls && (
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
      )}
    </Box>
  );
};

export default LayerSettings;
