import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, useTheme } from '@mui/material';
import {
  Add,
  Remove,
  GpsFixed,
  GpsNotFixed,
  Home,
  NearMe,
  NearMeOutlined,
} from '@mui/icons-material';

import { Latitude, Longitude, PointData } from 'features/areas/types';

type Props = {
  isFollowing?: boolean;
  onFitBounds: () => void;
  onFollowChange?: (follow: boolean) => void;
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
  isFollowing,
  onFollowChange,
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

            if (isUserLocationVisible) {
              setIsUserLocationVisible(false);
              isUserLocationVisibleRef.current = false;
              onFollowChange?.(false);

              if (geolocationWatchIdRef.current !== null) {
                navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
                geolocationWatchIdRef.current = null;
              }

              const latestPosition = latestPositionRef.current;
              if (latestPosition) {
                onGeolocate(latestPosition, null, false);
              } else {
                onGeolocate([0 as Longitude, 0 as Latitude], null, false);
              }
              return;
            }

            setIsAwaitingInitialPosition(true);
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const lat = pos.coords.latitude as Latitude;
                  const lng = pos.coords.longitude as Longitude;
                  const accuracy = pos.coords.accuracy ?? null;
                  const point: PointData = [lng, lat];

                  latestPositionRef.current = point;
                  latestAccuracyRef.current = accuracy;
                  setIsAwaitingInitialPosition(false);
                  setIsUserLocationVisible(true);
                  isUserLocationVisibleRef.current = true;

                  onGeolocate(point, accuracy, true);

                  geolocationWatchIdRef.current =
                    navigator.geolocation.watchPosition(
                      (watchPos) => {
                        const wLat = watchPos.coords.latitude as Latitude;
                        const wLng = watchPos.coords.longitude as Longitude;
                        const wAccuracy = watchPos.coords.accuracy ?? null;
                        const wPoint: PointData = [wLng, wLat];

                        latestPositionRef.current = wPoint;
                        latestAccuracyRef.current = wAccuracy;
                        if (isUserLocationVisibleRef.current) {
                          onGeolocate(wPoint, wAccuracy, true);
                        }
                      },
                      null,
                      {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 10000,
                      }
                    );
                },
                () => {
                  setIsAwaitingInitialPosition(false);
                  setIsUserLocationVisible(false);
                  isUserLocationVisibleRef.current = false;
                  if (geolocationWatchIdRef.current !== null) {
                    navigator.geolocation.clearWatch(
                      geolocationWatchIdRef.current
                    );
                    geolocationWatchIdRef.current = null;
                  }
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
              );
            } else {
              setIsAwaitingInitialPosition(false);
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
        {isUserLocationVisible && (
          <Button
            onClick={() => {
              const next = !isFollowing;
              onFollowChange?.(next);
              if (next) {
                const latestPosition = latestPositionRef.current;
                const latestAccuracy = latestAccuracyRef.current ?? null;
                if (latestPosition) {
                  onGeolocate(latestPosition, latestAccuracy, true);
                }
              }
            }}
          >
            {isFollowing ? <NearMe /> : <NearMeOutlined />}
          </Button>
        )}
      </ButtonGroup>
    </Box>
  );
};

export default ZUIMapControls;
