import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, useTheme } from '@mui/material';
import { Add, Remove, Home } from '@mui/icons-material';

import { Latitude, Longitude, PointData } from 'features/areas/types';
import { AnimatedGpsFixed } from 'zui/icons/AnimatedGpsFixed';

type Props = {
  onFitBounds: () => void;
  onGeolocate: (lngLat: PointData, accuracy: number | null) => void;
  onPositionChange?: (lngLat: PointData, accuracy: number | null) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const ZUIMapControls: React.FC<Props> = ({
  onFitBounds,
  onGeolocate,
  onPositionChange,
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

  const getPointAndAccuracyFromPos = (pos: GeolocationPosition) => {
    const lat = pos.coords.latitude as Latitude;
    const lng = pos.coords.longitude as Longitude;
    const accuracy = pos.coords.accuracy ?? null;
    const point: PointData = [lng, lat];

    return { accuracy, point };
  };

  const setPositionChange = (accuracy: number | null, point: PointData) => {
    latestPositionRef.current = point;
    latestAccuracyRef.current = accuracy;

    onPositionChange?.(point, accuracy);
  };

  const startWatchingPosition = () => {
    if (onPositionChange && !geolocationWatchIdRef.current) {
      geolocationWatchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { accuracy, point } = getPointAndAccuracyFromPos(pos);
          setPositionChange(accuracy, point);
        },
        () => {
          if (isAwaitingInitialPosition) {
            setIsAwaitingInitialPosition(false);
          }
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  };

  const handleGeolocateClick = () => {
    if (isAwaitingInitialPosition) {
      return;
    }

    if (!isUserLocationVisible) {
      setIsAwaitingInitialPosition(true);
      setIsUserLocationVisible(true);
      isUserLocationVisibleRef.current = true;
    }

    const latestPosition = latestPositionRef.current;
    const latestAccuracy = latestAccuracyRef.current ?? null;

    if (latestPosition && geolocationWatchIdRef.current !== null) {
      onGeolocate(latestPosition, latestAccuracy);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { accuracy, point } = getPointAndAccuracyFromPos(pos);

        setIsAwaitingInitialPosition(false);
        setPositionChange(accuracy, point);
        onGeolocate(point, accuracy);
        startWatchingPosition();
      },
      () => {
        setIsAwaitingInitialPosition(false);
        if (geolocationWatchIdRef.current !== null) {
          navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
          geolocationWatchIdRef.current = null;
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

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
        <Button onClick={handleGeolocateClick}>
          <AnimatedGpsFixed pulsing={isAwaitingInitialPosition} />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default ZUIMapControls;
