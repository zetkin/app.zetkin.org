import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, useTheme } from '@mui/material';
import { Add, Remove, GpsFixed, GpsNotFixed, Home } from '@mui/icons-material';

import { Latitude, Longitude, PointData } from 'features/areas/types';

type Props = {
  onFitBounds: () => void;
  onGeolocate: (
    lngLat: PointData,
    accuracy: number | null,
    tracking: boolean
  ) => void;
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
          onGeolocate(point, accuracy, true);
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

            const nextIsVisible = !isUserLocationVisible;
            setIsUserLocationVisible(nextIsVisible);
            isUserLocationVisibleRef.current = nextIsVisible;
            const latestPosition = latestPositionRef.current;
            const latestAccuracy = latestAccuracyRef.current ?? null;

            if (nextIsVisible) {
              if (latestPosition) {
                onGeolocate(latestPosition, latestAccuracy, true);
              } else {
                setIsAwaitingInitialPosition(true);
              }
            } else {
              if (latestPosition) {
                onGeolocate(latestPosition, null, false);
              } else {
                onGeolocate([0 as Longitude, 0 as Latitude], null, false);
              }
            }
          }}
        >
          {isAwaitingInitialPosition ? (
            <CircularProgress color="inherit" size={24} />
          ) : isUserLocationVisible ? (
            <GpsFixed />
          ) : (
            <GpsNotFixed />
          )}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ZUIMapControls;
