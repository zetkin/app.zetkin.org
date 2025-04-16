import CircularProgress from '@mui/material/CircularProgress';
import { Map } from 'leaflet';
import React, { useState } from 'react';
import { Box, Button, ButtonGroup, useTheme } from '@mui/material';
import { Add, Remove, GpsFixed, Home } from '@mui/icons-material';

type MapControlsProps = {
  map: Map | null;
  onFitBounds: () => void;
};

const MapControls: React.FC<MapControlsProps> = ({ map, onFitBounds }) => {
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
        <Button onClick={() => map?.zoomIn()}>
          <Add />
        </Button>
        <Button onClick={() => map?.zoomOut()}>
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

                const zoom = undefined; // We do not want to override the user's zoom level
                const latLng = {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                };

                map?.flyTo(latLng, zoom, {
                  animate: true,
                  duration: 0.8,
                });
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

export default MapControls;
