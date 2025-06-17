import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react';
import { Box, Button, ButtonGroup, useTheme } from '@mui/material';
import { Add, Remove, GpsFixed, Home } from '@mui/icons-material';

import { Latitude, Longitude, PointData } from 'features/areas/types';

type Props = {
  onFitBounds: () => void;
  onGeolocate: (lngLat: PointData) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const ZUIMapControls: React.FC<Props> = ({
  onFitBounds,
  onGeolocate,
  onZoomIn,
  onZoomOut,
}) => {
  const theme = useTheme();
  const [locating, setLocating] = useState(false);

  return (
    <Box
      sx={{
        left: 0,
        padding: 2, // This padding acts as a deadzone for the map, so that inaccurate taps don't cause the map to pan
        position: 'absolute',
        top: 0,
        zIndex: 999,
      }}
    >
      <ButtonGroup
        orientation="vertical"
        sx={{
          '& .MuiButton-root': {
            height: 40,
            padding: 0,
            width: 40,
          },
          bgcolor: theme.palette.background.default,
        }}
        variant="outlined"
      >
        <Button onClick={() => onZoomIn()}>
          <Add />
        </Button>
        <Button onClick={() => onZoomOut()}>
          <Remove />
        </Button>
        <Button onClick={onFitBounds}>
          <Home />
        </Button>
        <Button
          onClick={() => {
            if (locating) {
              return;
            }
            setLocating(true);
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setLocating(false);

                const lat = pos.coords.latitude as Latitude;
                const lng = pos.coords.longitude as Longitude;

                onGeolocate([lng, lat]);
              },
              () => {
                setLocating(false);
              },
              { enableHighAccuracy: true, timeout: 5000 }
            );
          }}
        >
          {locating ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            <GpsFixed />
          )}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ZUIMapControls;
