import CircularProgress from '@mui/material/CircularProgress';
import { Map } from 'leaflet';
import React, { MutableRefObject } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { Add, Remove, GpsFixed, Home } from '@mui/icons-material';

type MapControlsProps = {
  mapRef: MutableRefObject<Map | null>;
  onFitBounds: () => void;
  onLocate: () => { locating: boolean; setLocating: (value: boolean) => void };
};

const MapControls: React.FC<MapControlsProps> = ({
  mapRef,
  onFitBounds,
  onLocate,
}) => {
  const { locating, setLocating } = onLocate();

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
        <Button onClick={() => mapRef.current?.zoomIn()}>
          <Add />
        </Button>
        <Button onClick={() => mapRef.current?.zoomOut()}>
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

                mapRef.current?.flyTo(latLng, zoom, {
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
