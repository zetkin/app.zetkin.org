import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { LatLng, latLngBounds, Map } from 'leaflet';
import { makeStyles } from '@mui/styles';
import { Add, GpsNotFixed, Remove } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  AttributionControl,
  MapContainer,
  Polygon,
  TileLayer,
} from 'react-leaflet';

import { ZetkinArea } from '../types';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { CreatePlaceCard } from './CreatePlaceCard';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import PlaceDialog from './PlaceDialog';
import useCreatePlace from '../hooks/useCreatePlace';
import usePlaces from '../hooks/usePlaces';
import getCrosshairPositionOnMap from '../utils/getCrosshairPositionOnMap';
import MarkerIcon from '../utils/markerIcon';

const useStyles = makeStyles((theme) => ({
  '@keyframes ghostMarkerBounce': {
    '0%': {
      top: -20,
      transform: 'scale(1, 0.8)',
    },
    '100%': {
      top: -40,
      transform: 'scale(0.9, 1)',
    },
  },
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
  ghostMarker: {
    animationDirection: 'alternate',
    animationDuration: '0.4s',
    animationIterationCount: 'infinite',
    animationName: '$ghostMarkerBounce',
    animationTimingFunction: 'cubic-bezier(0,.71,.56,1)',
    position: 'absolute',
    zIndex: 1000,
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
  const places = usePlaces(area.organization.id).data || [];
  const createPlace = useCreatePlace(area.organization.id);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [dialogStep, setDialogStep] = useState<'place' | 'edit' | 'household'>(
    'place'
  );
  const [standingStill, setStandingStill] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [map, setMap] = useState<Map | null>(null);
  const crosshairRef = useRef<HTMLDivElement | null>(null);
  const standingStillTimerRef = useRef(0);

  const selectedPlace = places.find((place) => place.id == selectedPlaceId);
  const showViewPlaceButton = !!selectedPlace && !anchorEl;

  const updateSelection = useCallback(() => {
    let nearestPlace: string | null = null;
    let nearestDistance = Infinity;

    const crosshair = crosshairRef.current;

    if (map && crosshair) {
      const markerPos = getCrosshairPositionOnMap(map, crosshair);

      places.forEach((place) => {
        const screenPos = map.latLngToContainerPoint(place.position);
        const dx = screenPos.x - markerPos.markerX;
        const dy = screenPos.y - markerPos.markerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestPlace = place.id;
        }
      });

      if (nearestDistance < 20) {
        if (nearestPlace != selectedPlace) {
          setSelectedPlaceId(nearestPlace);
        }
      } else {
        setSelectedPlaceId(null);
      }
    }
  }, [map, selectedPlaceId, places]);

  const panTo = useCallback(
    (pos: LatLng) => {
      const crosshair = crosshairRef.current;
      if (crosshair && map) {
        const markerPos = getCrosshairPositionOnMap(map, crosshair);

        const crosshairPos = map.containerPointToLatLng([
          markerPos.markerX,
          markerPos.markerY,
        ]);
        const centerPos = map.getCenter();
        const latOffset = centerPos.lat - crosshairPos.lat;
        const lngOffset = centerPos.lng - crosshairPos.lng;
        const adjustedPos = new LatLng(
          pos.lat + latOffset,
          pos.lng + lngOffset
        );
        map.panTo(adjustedPos, { animate: true });
      }
    },
    [map, crosshairRef.current]
  );

  useEffect(() => {
    if (map) {
      map.on('click', (evt) => {
        panTo(evt.latlng);
      });

      map.on('movestart', () => {
        window.clearTimeout(standingStillTimerRef.current);
        setStandingStill(false);
      });

      map.on('move', () => {
        updateSelection();
      });

      map.on('moveend', () => {
        // When the map contains no places, show the bouncy marker
        // quickly, but once there are places, wait longer before
        // showing the bouncy marker.
        const delay = places.length ? 10000 : 1300;

        standingStillTimerRef.current = window.setTimeout(
          () => setStandingStill(true),
          delay
        );
      });

      return () => {
        map.off('move');
        map.off('moveend');
        map.off('movestart');
      };
    }
  }, [map, selectedPlaceId, places, panTo, updateSelection]);

  useEffect(() => {
    updateSelection();
  }, [places]);

  return (
    <>
      <Box className={classes.zoomControls}>
        <IconButton onClick={() => map?.zoomIn()}>
          <Add />
        </IconButton>
        <Divider flexItem variant="fullWidth" />
        <IconButton onClick={() => map?.zoomOut()}>
          <Remove />
        </IconButton>
      </Box>
      <Box position="relative">
        <Box
          ref={crosshairRef}
          className={classes.crosshair}
          sx={{
            opacity: !selectedPlaceId ? 1 : 0.3,
          }}
        >
          {!selectedPlaceId && !isCreating && (
            <Box
              className={classes.ghostMarker}
              sx={{
                opacity: standingStill ? 1 : 0,
                transition: `opacity ${standingStill ? 0.8 : 0.2}s`,
              }}
            >
              <MarkerIcon selected={true} />
            </Box>
          )}
          {!selectedPlaceId && isCreating && (
            <Box
              className={classes.ghostMarker}
              sx={{
                opacity: 1,
                transition: `opacity  0.8s`,
              }}
            >
              <MarkerIcon selected={true} />
            </Box>
          )}
          <GpsNotFixed />
        </Box>
      </Box>
      <Box className={classes.actionAreaContainer}>
        {showViewPlaceButton && (
          <Box className={classes.infoButtons}>
            <Typography sx={{ paddingBottom: 1 }}>
              {selectedPlace.title || <Msg id={messageIds.place.empty.title} />}
            </Typography>
            <Button
              fullWidth
              onClick={(ev) => {
                setAnchorEl(ev.currentTarget);
                setDialogStep('place');
              }}
              variant="outlined"
            >
              <Msg id={messageIds.viewPlaceButton} />
            </Button>
          </Box>
        )}
        {!selectedPlace && !isCreating && (
          <Button onClick={() => setIsCreating(true)} variant="contained">
            <Msg id={messageIds.addNewPlaceButton} />
          </Button>
        )}
      </Box>
      <MapContainer
        ref={(map) => setMap(map)}
        attributionControl={false}
        bounds={latLngBounds(area.points)}
        minZoom={1}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer
          attribution="<span style='color:#a3a3a3;'>Leaflet & OpenStreetMap</span>"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon color={theme.palette.primary.main} positions={area.points} />
        <>
          {places.map((place) => {
            const selected = place.id == selectedPlaceId;
            const key = `marker-${place.id}-${selected.toString()}`;

            return (
              <DivIconMarker
                key={key}
                eventHandlers={{
                  click: (evt) => {
                    panTo(evt.latlng);
                  },
                }}
                iconAnchor={[11, 33]}
                position={{
                  lat: place.position.lat,
                  lng: place.position.lng,
                }}
              >
                <MarkerIcon selected={selected} />
              </DivIconMarker>
            );
          })}
        </>
      </MapContainer>
      {selectedPlace && (
        <PlaceDialog
          dialogStep={dialogStep}
          onClose={() => {
            setAnchorEl(null);
            setSelectedPlaceId(null);
          }}
          onEdit={() => setDialogStep('edit')}
          onSelectHousehold={() => setDialogStep('household')}
          onUpdateDone={() => setDialogStep('place')}
          open={!!anchorEl}
          orgId={area.organization.id}
          place={selectedPlace}
        />
      )}
      {isCreating && (
        <CreatePlaceCard
          onClose={() => {
            setIsCreating(false);
          }}
          onCreate={(title, type, numberOfHouseholds) => {
            const crosshair = crosshairRef.current;

            if (crosshair && map) {
              const markerPos = getCrosshairPositionOnMap(map, crosshair);

              const point = map?.containerPointToLatLng([
                markerPos.markerX,
                markerPos.markerY,
              ]);
              if (point) {
                createPlace({
                  numberOfHouseholds,
                  position: point,
                  title,
                  type: type === 'address' ? 'address' : 'misc',
                });
              }
            }
          }}
        />
      )}
    </>
  );
};

export default PublicAreaMap;
