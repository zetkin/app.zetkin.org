import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { FC, useRef, useState } from 'react';

import { MapStyle } from './PlanMap';

type LayerSettingsProps = {
  mapStyle: MapStyle;
  onMapStyleChange: (newMapStyle: MapStyle) => void;
};

const LayerSettings: FC<LayerSettingsProps> = ({
  mapStyle,
  onMapStyleChange,
}) => {
  const planPreset: MapStyle = {
    area: 'assignees',
    overlay: 'assignees',
    place: 'dot',
  };
  const isPlanPreset =
    mapStyle.area == planPreset.area &&
    mapStyle.overlay == planPreset.overlay &&
    mapStyle.place == planPreset.place;

  const executePreset: MapStyle = {
    area: 'households',
    overlay: 'households',
    place: 'households',
  };
  const isExecutePreset =
    mapStyle.area == executePreset.area &&
    mapStyle.overlay == executePreset.overlay &&
    mapStyle.place == executePreset.place;

  const evaluatePreset: MapStyle = {
    area: 'progress',
    overlay: 'assignees',
    place: 'progress',
  };
  const isEvaluatePreset =
    mapStyle.area == evaluatePreset.area &&
    mapStyle.overlay == evaluatePreset.overlay &&
    mapStyle.place == evaluatePreset.place;

  const isPreset = isPlanPreset || isEvaluatePreset || isExecutePreset;

  const [showCustomControls, setShowCustomControls] = useState(!isPreset);
  const customSettingsRef = useRef<MapStyle>({
    area: 'hide',
    overlay: 'hide',
    place: 'hide',
  });

  return (
    <Box alignItems="flex-start" display="flex" flexDirection="column" gap={1}>
      The style of your map layers
      <Box
        bgcolor={isPlanPreset && !showCustomControls ? 'lightblue' : ''}
        border={1}
        onClick={() => {
          setShowCustomControls(false);
          onMapStyleChange(planPreset);
        }}
        padding={1}
        sx={{ cursor: 'pointer' }}
      >
        <Typography>Plan</Typography>
      </Box>
      <Box
        bgcolor={isExecutePreset && !showCustomControls ? 'lightblue' : ''}
        border={1}
        onClick={() => {
          setShowCustomControls(false);
          onMapStyleChange(executePreset);
        }}
        padding={1}
        sx={{ cursor: 'pointer' }}
      >
        <Typography>Execute</Typography>
      </Box>
      <Box
        bgcolor={isEvaluatePreset && !showCustomControls ? 'lightblue' : ''}
        border={1}
        onClick={() => {
          setShowCustomControls(false);
          onMapStyleChange(evaluatePreset);
        }}
        padding={1}
        sx={{ cursor: 'pointer' }}
      >
        <Typography>Evaluate</Typography>
      </Box>
      <Box
        bgcolor={!isPreset || showCustomControls ? 'lightblue' : ''}
        border={1}
        onClick={() => {
          setShowCustomControls(true);
          onMapStyleChange(customSettingsRef.current);
        }}
        padding={1}
        sx={{ cursor: 'pointer' }}
      >
        <Typography>Custom</Typography>
      </Box>
      {showCustomControls && (
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          paddingTop={1}
          width="100%"
        >
          <FormControl variant="outlined">
            <InputLabel id="place-style-label">Place</InputLabel>
            <Select
              fullWidth
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
                  onMapStyleChange({ ...mapStyle, place: newValue });
                  customSettingsRef.current = { ...mapStyle, place: newValue };
                }
              }}
              value={mapStyle.place}
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
              fullWidth
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
                  onMapStyleChange({ ...mapStyle, area: newValue });
                  customSettingsRef.current = { ...mapStyle, area: newValue };
                }
              }}
              value={mapStyle.area}
            >
              <MenuItem value="assignees">Assignees</MenuItem>
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
              fullWidth
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
