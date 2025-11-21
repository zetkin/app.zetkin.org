import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, useTheme } from '@mui/material';
import { Add, Remove, Home } from '@mui/icons-material';

import { Latitude, Longitude, PointData } from 'features/areas/types';
import { AnimatedGpsFixed } from 'zui/icons/AnimatedGpsFixed';

type Props = {
  onFitBounds: () => void;
  onGeolocate: (lngLat: PointData, accuracy: number | null) => void;
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
  const [isAwaitingInitialPosition, setIsAwaitingInitialPosition] =
    useState(false);
  const geolocationWatchIdRef = useRef<number | null>(null);
  const latestPositionRef = useRef<PointData | null>(null);
  const latestAccuracyRef = useRef<number | null>(null);
  const [isUserLocationVisible, setIsUserLocationVisible] = useState(false);
  const isUserLocationVisibleRef = useRef<boolean>(false);

  useEffect(() => {
    geolocationWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude as Latitude;
        const lng = pos.coords.longitude as Longitude;
        const accuracy = pos.coords.accuracy ?? null;
        const point: PointData = [lng, lat];

        latestPositionRef.current = point;
        latestAccuracyRef.current = accuracy;
        if (isAwaitingInitialPosition) {
          setIsAwaitingInitialPosition(false);
        }
        if (isUserLocationVisibleRef.current) {
          onGeolocate(point, accuracy);
        }
      },
      () => {
        if (isAwaitingInitialPosition) {
          setIsAwaitingInitialPosition(false);
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => {
      if (geolocationWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
        geolocationWatchIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    isUserLocationVisibleRef.current = isUserLocationVisible;
  }, [isUserLocationVisible]);

  return (
    <Box
      sx={{
        left: 0,
        padding: 2,
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
            if (isAwaitingInitialPosition) {
              return;
            }
            if (!isUserLocationVisible) {
              setIsUserLocationVisible(true);
              isUserLocationVisibleRef.current = true;
            }

            const latestPosition = latestPositionRef.current;
            const latestAccuracy = latestAccuracyRef.current ?? null;

            if (latestPosition) {
              onGeolocate(latestPosition, latestAccuracy);
            } else {
              setIsAwaitingInitialPosition(true);
            }
          }}
        >
          <AnimatedGpsFixed pulsing={isAwaitingInitialPosition} />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ZUIMapControls;
