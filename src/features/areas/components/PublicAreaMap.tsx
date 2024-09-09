import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { latLngBounds, Map } from 'leaflet';
import { makeStyles } from '@mui/styles';
import { Add, GpsNotFixed, Remove } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';

import { ZetkinArea, ZetkinPlace } from '../types';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import usePlaces from '../hooks/usePlaces';
import useCreatePlace from '../hooks/useCreatePlace';
import ZUIDateTime from 'zui/ZUIDateTime';

const useStyles = makeStyles((theme) => ({
  actionAreaContainer: {
    bottom: 15,
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
  crosshair: {
    left: '50%',
    position: 'absolute',
    top: '40vh',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.1s',
    zIndex: 1200,
  },
  infoButtons: {
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    width: '90%',
  },
  zoomControls: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    left: 10,
    marginTop: 10,
    position: 'absolute',
    zIndex: 1000,
  },
}));

type PublicAreaMapProps = {
  area: ZetkinArea;
};

const PublicAreaMap: FC<PublicAreaMapProps> = ({ area }) => {
  const theme = useTheme();
  const classes = useStyles();
  const createPlace = useCreatePlace(area.organization.id);
  const places = usePlaces(area.organization.id).data || [];

  const [selectedPlace, setSelectedPlace] = useState<ZetkinPlace | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const mapRef = useRef<Map | null>(null);
  const crosshairRef = useRef<HTMLDivElement | null>(null);

  const showViewPlaceButton = !!selectedPlace && !anchorEl;

  const updateSelection = useCallback(() => {
    let nearestPlace: ZetkinPlace | null = null;
    let nearestDistance = Infinity;

    const map = mapRef.current;
    const crosshair = crosshairRef.current;

    if (map && crosshair) {
      const mapContainer = map.getContainer();
      const markerRect = crosshair.getBoundingClientRect();
      const mapRect = mapContainer.getBoundingClientRect();
      const x = markerRect.x - mapRect.x;
      const y = markerRect.y - mapRect.y;
      const markerX = x + 0.5 * markerRect.width;
      const markerY = y + 0.5 * markerRect.height;

      places.forEach((place) => {
        const screenPos = map.latLngToContainerPoint(place.position);
        const dx = screenPos.x - markerX;
        const dy = screenPos.y - markerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestPlace = place;
        }
      });

      if (nearestDistance < 20) {
        if (nearestPlace != selectedPlace) {
          setSelectedPlace(nearestPlace);
        }
      } else {
        setSelectedPlace(null);
      }
    }
  }, [mapRef.current, selectedPlace, places]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.on('move', () => {
        updateSelection();
      });

      return () => {
        map.off('move');
      };
    }
  }, [mapRef.current, selectedPlace, places]);

  useEffect(() => {
    updateSelection();
  }, [places]);

  return (
    <>
      <Box className={classes.zoomControls}>
        <IconButton onClick={() => mapRef.current?.zoomIn()}>
          <Add />
        </IconButton>
        <Divider flexItem variant="fullWidth" />
        <IconButton onClick={() => mapRef.current?.zoomOut()}>
          <Remove />
        </IconButton>
      </Box>
      <Box position="relative">
        <Box
          ref={crosshairRef}
          className={classes.crosshair}
          sx={{
            opacity: !selectedPlace ? 1 : 0.3,
          }}
        >
          <GpsNotFixed />
        </Box>
      </Box>
      <Box className={classes.actionAreaContainer}>
        {showViewPlaceButton && (
          <Box className={classes.infoButtons}>
            <Button
              onClick={(ev) => setAnchorEl(ev.currentTarget)}
              variant="outlined"
            >
              <Msg id={messageIds.viewPlaceButton} />
            </Button>
          </Box>
        )}
        {!selectedPlace && (
          <Button
            onClick={() => {
              const crosshair = crosshairRef.current;
              const mapContainer = mapRef.current?.getContainer();
              if (crosshair && mapContainer) {
                const mapRect = mapContainer.getBoundingClientRect();
                const markerRect = crosshair.getBoundingClientRect();
                const x = markerRect.x - mapRect.x;
                const y = markerRect.y - mapRect.y;
                const markerPoint: [number, number] = [
                  x + 0.5 * markerRect.width,
                  y + 0.8 * markerRect.height,
                ];

                const point =
                  mapRef.current?.containerPointToLatLng(markerPoint);
                if (point) {
                  createPlace({
                    position: point,
                  });
                }
              }
            }}
            variant="contained"
          >
            <Msg id={messageIds.addNewPlaceButton} />
          </Button>
        )}
      </Box>
      <MapContainer
        ref={mapRef}
        bounds={latLngBounds(area.points)}
        minZoom={1}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon color={theme.palette.primary.main} positions={area.points} />
        <>
          {places.map((place) => {
            const selected = place.id == selectedPlace?.id;
            const key = `marker-${place.id}-${selected.toString()}`;

            return (
              <DivIconMarker
                key={key}
                iconAnchor={[11, 33]}
                position={{
                  lat: place.position.lat,
                  lng: place.position.lng,
                }}
              >
                <svg fill="none" height="35" viewBox="0 0 30 40" width="25">
                  <path
                    d="M14 38.479C13.6358 38.0533 13.1535 37.4795
           12.589 36.7839C11.2893 35.1826 9.55816 32.9411
            7.82896 30.3782C6.09785 27.8124 4.38106 24.9426
            3.1001 22.0833C1.81327 19.211 1 16.4227 1 14C1
            6.81228 6.81228 1 14 1C21.1877 1 27 6.81228 27 14C27
            16.4227 26.1867 19.211 24.8999 22.0833C23.6189 24.9426
            21.9022 27.8124 20.171 30.3782C18.4418 32.9411 16.7107
            35.1826 15.411 36.7839C14.8465 37.4795 14.3642
            38.0533 14 38.479Z"
                    fill={selected ? '#ED1C55' : 'white'}
                    stroke="#ED1C55"
                    strokeWidth="2"
                  />
                </svg>
              </DivIconMarker>
            );
          })}
        </>
      </MapContainer>
      <Dialog
        fullWidth
        maxWidth="xl"
        onClose={() => {
          setAnchorEl(null);
          setSelectedPlace(null);
        }}
        open={!!anchorEl}
      >
        {selectedPlace && (
          <Box height="90vh" padding={2}>
            <Box
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="space-between"
            >
              <Box>
                <Box paddingBottom={1}>
                  <Typography variant="h6">
                    {selectedPlace.title || (
                      <Msg id={messageIds.place.empty.title} />
                    )}
                  </Typography>
                </Box>
                <Divider />
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  paddingTop={1}
                >
                  <Typography variant="h6">
                    <Msg id={messageIds.place.description} />
                  </Typography>
                  <Typography>
                    {selectedPlace.description || (
                      <Msg id={messageIds.place.empty.description} />
                    )}
                  </Typography>
                  <Typography variant="h6">
                    <Msg id={messageIds.place.activityHeader} />
                  </Typography>
                  <Box>
                    {selectedPlace.visits.length == 0 && (
                      <Msg id={messageIds.place.noActivity} />
                    )}
                    {selectedPlace.visits.map((visit) => (
                      <Box key={visit.id}>
                        <Typography color="secondary">
                          <ZUIDateTime datetime={visit.timestamp} />
                        </Typography>
                        <Typography>{visit.note}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  onClick={() => {
                    setAnchorEl(null);
                    setSelectedPlace(null);
                  }}
                  variant="outlined"
                >
                  <Msg id={messageIds.place.closeButton} />
                </Button>
                <Button disabled variant="contained">
                  <Msg id={messageIds.place.logActivityButton} />
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default PublicAreaMap;
