import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { latLngBounds, Map } from 'leaflet';
import { makeStyles } from '@mui/styles';
import { Add, GpsNotFixed, Remove } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, useTheme } from '@mui/material';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';

import { ZetkinArea } from '../types';
import useAreaMutations from '../hooks/useAreaMutations';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';

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
    zIndex: 2000,
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
  const { updateArea } = useAreaMutations(area.organization.id, area.id);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const mapRef = useRef<Map | null>(null);
  const crosshairRef = useRef<HTMLDivElement | null>(null);

  const updateSelection = useCallback(() => {
    let nearestIndex = -1;
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

      area.markers.forEach((marker, index) => {
        const screenPos = map.latLngToContainerPoint(marker.position);
        const dx = screenPos.x - markerX;
        const dy = screenPos.y - markerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestIndex = index;
        }
      });

      if (nearestDistance < 20) {
        if (nearestIndex != selectedIndex) {
          setSelectedIndex(nearestIndex);
        }
      } else {
        setSelectedIndex(-1);
      }
    }
  }, [mapRef.current, selectedIndex, area]);

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
  }, [mapRef.current, selectedIndex, area]);

  useEffect(() => {
    updateSelection();
  }, [area.markers]);

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
            opacity: selectedIndex < 0 ? 1 : 0.3,
          }}
        >
          <GpsNotFixed />
        </Box>
      </Box>
      <Box className={classes.actionAreaContainer}>
        {selectedIndex < 0 && (
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
                  updateArea({
                    markers: [
                      ...area.markers,
                      {
                        numberOfActions: 1,
                        position: point,
                      },
                    ],
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
          {area.markers.map((marker, index) => {
            const selected = index == selectedIndex;
            const key = `marker-${index}-${selected.toString()}`;

            return (
              <DivIconMarker
                key={key}
                iconAnchor={[11, 33]}
                position={{
                  lat: marker.position.lat,
                  lng: marker.position.lng,
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
    </>
  );
};

export default PublicAreaMap;
