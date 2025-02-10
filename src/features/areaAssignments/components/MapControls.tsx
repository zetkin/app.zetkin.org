import CircularProgress from '@mui/material/CircularProgress';
import { Map } from 'leaflet';
import React, { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { Add, Remove, GpsFixed, Home } from '@mui/icons-material';

type MapControlsProps = {
  map: Map | null;
  onFitBounds: () => void;
};

const MapControls: React.FC<MapControlsProps> = ({ map, onFitBounds }) => {
  const [locating, setLocating] = useState(false);

  return (
    <Box
      sx={{
        left: 16,
        position: 'absolute',
        top: 16,
        zIndex: 999,
      }}
    >
      <ButtonGroup orientation="vertical" variant="contained">
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
            setLocating(true);
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setLocating(false);

                const zoom = 16;
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
