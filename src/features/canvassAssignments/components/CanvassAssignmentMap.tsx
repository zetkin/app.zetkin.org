import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  LatLng,
  Map,
  FeatureGroup as FeatureGroupType,
  latLngBounds,
} from 'leaflet';
import { makeStyles } from '@mui/styles';
import { GpsNotFixed } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import {
  AttributionControl,
  FeatureGroup,
  MapContainer,
  Polygon,
  TileLayer,
} from 'react-leaflet';

import { ZetkinArea } from '../../areas/types';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import useCreatePlace from '../hooks/useCreatePlace';
import usePlaces from '../hooks/usePlaces';
import getCrosshairPositionOnMap from '../utils/getCrosshairPositionOnMap';
import getVisitState from '../utils/getVisitState';
import MarkerIcon from '../utils/markerIcon';
import { ZetkinCanvassAssignment } from '../types';
import MapControls from './MapControls';
import objToLatLng from 'features/areas/utils/objToLatLng';
import CanvassAssignmentMapOverlays from './CanvassAssignmentMapOverlays';

const useStyles = makeStyles(() => ({
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
}));

type CanvassAssignmentMapProps = {
  areas: ZetkinArea[];
  assignment: ZetkinCanvassAssignment;
};

const CanvassAssignmentMap: FC<CanvassAssignmentMapProps> = ({
  areas,
  assignment,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const places = usePlaces(assignment.organization.id).data || [];
  const createPlace = useCreatePlace(assignment.organization.id);

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const [map, setMap] = useState<Map | null>(null);
  const crosshairRef = useRef<HTMLDivElement | null>(null);
  const reactFGref = useRef<FeatureGroupType | null>(null);

  const [zoomed, setZoomed] = useState(false);

  const selectedPlace = places.find((place) => place.id == selectedPlaceId);

  const updateSelection = useCallback(() => {
    let nearestPlace: string | null = null;
    let nearestDistance = Infinity;

    if (isCreating) {
      if (selectedPlaceId) {
        setSelectedPlaceId(null);
      }
      return;
    }

    const crosshair = crosshairRef.current;

    try {
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
    } catch (err) {
      // Do nothing for now
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
    if (created) {
      updateSelection();
    }
  }, [created, places]);

  useEffect(() => {
    if (map) {
      map.on('click', (evt) => {
        panTo(evt.latlng);
      });

      map.on('move', () => {
        updateSelection();
      });

      return () => {
        map.off('move');
        map.off('moveend');
        map.off('movestart');
      };
    }
  }, [map, selectedPlaceId, places, panTo, updateSelection]);

  useEffect(() => {
    if (map && !zoomed) {
      const bounds = reactFGref.current?.getBounds();
      if (bounds?.isValid()) {
        map.fitBounds(bounds);
        setZoomed(true);
      }
    }
  }, [areas, map]);

  return (
    <>
      <Box position="relative">
        <MapControls
          map={map}
          onFitBounds={() => {
            if (map) {
              if (areas.length) {
                // Start with first area
                const totalBounds = latLngBounds(
                  areas[0].points.map((p) => objToLatLng(p))
                );

                // Extend with all areas
                areas.forEach((area) => {
                  const areaBounds = latLngBounds(
                    area.points.map((p) => objToLatLng(p))
                  );
                  totalBounds.extend(areaBounds);
                });

                if (totalBounds) {
                  map.flyToBounds(totalBounds, {
                    animate: true,
                    duration: 0.8,
                  });
                }
              }
            }
          }}
        />
        <Box
          ref={crosshairRef}
          className={classes.crosshair}
          sx={{
            opacity: !selectedPlaceId ? 1 : 0.3,
          }}
        >
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
      <MapContainer
        ref={(map) => setMap(map)}
        attributionControl={false}
        minZoom={1}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer
          attribution="<span style='color:#a3a3a3;'>Leaflet & OpenStreetMap</span>"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup
          ref={(fgRef) => {
            reactFGref.current = fgRef;
          }}
        >
          {areas.map((area) => (
            <Polygon
              key={area.id}
              color={theme.palette.primary.main}
              positions={area.points}
            />
          ))}
        </FeatureGroup>
        {places.map((place) => {
          const state = getVisitState(place.households, assignment.id);

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
              <MarkerIcon
                dataToShow="visited"
                selected={selected}
                state={state}
              />
            </DivIconMarker>
          );
        })}
      </MapContainer>
      <CanvassAssignmentMapOverlays
        assignment={assignment}
        isCreating={isCreating}
        onCreate={(title) => {
          const crosshair = crosshairRef.current;

          if (crosshair && map) {
            const markerPos = getCrosshairPositionOnMap(map, crosshair);

            const point = map?.containerPointToLatLng([
              markerPos.markerX,
              markerPos.markerY,
            ]);
            if (point) {
              setCreated(true);
              createPlace({
                position: point,
                title,
              });
            }
          }
        }}
        onToggleCreating={(creating) => setIsCreating(creating)}
        selectedPlace={selectedPlace || null}
      />
    </>
  );
};

export default CanvassAssignmentMap;
