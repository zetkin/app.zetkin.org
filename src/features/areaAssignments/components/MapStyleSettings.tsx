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
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import theme from 'theme';

type MapStyleSettingsProps = {
  mapStyle: MapStyle;
  onMapStyleChange: (newMapStyle: MapStyle) => void;
};

const MapStyleSettings: FC<MapStyleSettingsProps> = ({
  mapStyle,
  onMapStyleChange,
}) => {
  const locationMarkers = [
    {
      image: {
        alt: 'Dot option',
        src: '/location-dot.svg',
      },
      label: messageIds.map.mapStyle.markers.options.dot,
      value: 'dot',
    },
    {
      image: {
        alt: 'Households option',
        src: '/location-households.svg',
      },
      label: messageIds.map.mapStyle.markers.options.households,
      value: 'households',
    },
    {
      image: {
        alt: 'Progress option',
        src: '/location-progress.svg',
      },
      label: messageIds.map.mapStyle.markers.options.progress,
      value: 'progress',
    },
    {
      image: {
        alt: 'Hide option',
        src: '/location-hidden.svg',
      },
      label: messageIds.map.mapStyle.markers.options.hidden,
      value: 'hide',
    },
  ];

  const areaMarkers = [
    {
      image: {
        alt: 'Center area assignees',
        src: '/area-marker-assignees.svg',
      },
      label: messageIds.map.mapStyle.center.options.assignees,
      value: 'assignees',
    },
    {
      image: {
        alt: 'Center area households',
        src: '/area-marker-locations-households.svg',
      },
      label: messageIds.map.mapStyle.center.options.households,
      value: 'households',
    },
    {
      image: {
        alt: 'Center area progress',
        src: '/area-marker-assignment-progress.svg',
      },
      label: messageIds.map.mapStyle.center.options.progress,
      value: 'progress',
    },
    {
      image: {
        alt: 'Center area hidden',
        src: '/area-marker-hidden.svg',
      },
      label: messageIds.map.mapStyle.center.options.hidden,
      value: 'hide',
    },
  ];

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
            <Typography>
              <Msg id={messageIds.map.mapStyle.markers.label} />
            </Typography>
          </Box>
          <RadioGroup
            onChange={(ev) => {
              const newValue = ev.target.value;
              if (
                newValue === 'dot' ||
                newValue === 'households' ||
                newValue === 'progress' ||
                newValue === 'hide'
              ) {
                onMapStyleChange({ ...mapStyle, location: newValue });
              }
            }}
            sx={{ ml: 1 }}
            value={mapStyle.location}
          >
            {locationMarkers.map(({ value, label, image }) => (
              <Box
                key={value}
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                pb={1}
              >
                <FormControlLabel
                  control={<Radio />}
                  label={<Msg id={label} />}
                  value={value}
                />
                <Box
                  alt={image.alt}
                  component="img"
                  src={image.src}
                  sx={{
                    border: '1px solid',
                    borderColor: theme.palette.grey[300],
                    borderRadius: 1,
                    height: 'auto',
                    maxWidth: 60,
                    width: '100%',
                  }}
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" variant="outlined">
          <Box display="flex" gap={1} paddingBottom={1}>
            <Typography>
              <Msg id={messageIds.map.mapStyle.center.label} />
            </Typography>
          </Box>
          <RadioGroup
            onChange={(ev) => {
              const newValue = ev.target.value;
              if (
                newValue === 'assignees' ||
                newValue === 'households' ||
                newValue === 'progress' ||
                newValue === 'hide'
              ) {
                onMapStyleChange({ ...mapStyle, overlay: newValue });
              }
            }}
            sx={{ ml: 1 }}
            value={mapStyle.overlay}
          >
            {areaMarkers.map(({ image, value, label }) => (
              <Box
                key={value}
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                pb={1}
              >
                <FormControlLabel
                  control={<Radio />}
                  label={<Msg id={label} />}
                  value={value}
                />
                <Box
                  alt={image.alt}
                  component="img"
                  src={image.src}
                  sx={{
                    border: '1px solid',
                    borderColor: theme.palette.grey[300],
                    borderRadius: 1,
                    height: 'auto',
                    maxWidth: 60,
                    width: '100%',
                  }}
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" variant="outlined">
          <Box display="flex" gap={1} paddingBottom={1}>
            <Typography>
              <Msg id={messageIds.map.mapStyle.area.label} />
            </Typography>
          </Box>
          <RadioGroup
            onChange={(ev) => {
              const newValue = ev.target.value;
              if (
                newValue === 'households' ||
                newValue === 'assignees' ||
                newValue === 'progress' ||
                newValue === 'hide' ||
                newValue === 'outlined'
              ) {
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
                label: messageIds.map.mapStyle.area.options.households,
                value: 'households',
              },
              {
                label: messageIds.map.mapStyle.area.options.progress,
                value: 'progress',
              },
              {
                label: messageIds.map.mapStyle.area.options.outlined,
                value: 'outlined',
              },
              {
                label: messageIds.map.mapStyle.area.options.hidden,
                value: 'hide',
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
