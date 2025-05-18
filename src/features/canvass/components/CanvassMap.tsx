import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  LatLng,
  Map,
  FeatureGroup as FeatureGroupType,
  latLngBounds,
  LatLngBounds,
  LatLngTuple,
  LeafletMouseEvent,
  LatLngExpression,
} from 'leaflet';
import { makeStyles } from '@mui/styles';
import { GpsNotFixed } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import {
  AttributionControl,
  FeatureGroup,
  MapContainer,
  Pane,
  Polygon,
  TileLayer,
} from 'react-leaflet';

import CanvassMapOverlays from './CanvassMapOverlays';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import getCrosshairPositionOnMap from '../utils/getCrosshairPositionOnMap';
import { getVisitPercentage } from '../utils/getVisitPercentage';
import MapControls from 'features/areaAssignments/components/MapControls';
import MarkerIcon from './MarkerIcon';
import objToLatLng from 'features/areas/utils/objToLatLng';
import useCreateLocation from '../hooks/useCreateLocation';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import { useEnv } from 'core/hooks';
import useLocations from 'features/areaAssignments/hooks/useLocations';
import { ZetkinArea } from '../../areas/types';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { useAutoResizeMap } from 'features/map/hooks/useResizeMap';

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

type CanvassMapProps = {
  areas: ZetkinArea[];
  assignment: ZetkinAreaAssignment;
};

const CanvassMap: FC<CanvassMapProps> = ({ areas, assignment }) => {
  const env = useEnv();
  const theme = useTheme();
  const classes = useStyles();
  const locations = useLocations(assignment.organization.id).data || [];
  const createLocation = useCreateLocation(assignment.organization.id);
  const [localStorageBounds, setLocalStorageBounds] = useLocalStorage<
    [LatLngTuple, LatLngTuple] | null
  >(`mapBounds-${assignment.id}`, null);

  const [map, setMap] = useState<Map | null>(null);
  useAutoResizeMap(map);
  const [zoomed, setZoomed] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const crosshairRef = useRef<HTMLDivElement | null>(null);
  const reactFGref = useRef<FeatureGroupType | null>(null);

  const selectedLocation = locations.find(
    (location) => location.id == selectedLocationId
  );

  const saveBounds = () => {
    const bounds = map?.getBounds();

    if (bounds) {
      setLocalStorageBounds([
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()],
      ]);
    }
  };

  const updateSelection = useCallback(() => {
    let nearestLocation: string | null = null;
    let nearestDistance = Infinity;

    if (isCreating) {
      if (selectedLocationId) {
        setSelectedLocationId(null);
      }
      return;
    }

    const crosshair = crosshairRef.current;

    try {
      if (map && crosshair) {
        const markerPos = getCrosshairPositionOnMap(map, crosshair);

        locations.forEach((location) => {
          const screenPos = map.latLngToContainerPoint(location.position);
          const dx = screenPos.x - markerPos.markerX;
          const dy = screenPos.y - markerPos.markerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < nearestDistance) {
            nearestDistance = dist;
            nearestLocation = location.id;
          }
        });

        if (nearestDistance < 20) {
          if (nearestLocation != selectedLocation) {
            setSelectedLocationId(nearestLocation);
          }
        } else {
          setSelectedLocationId(null);
        }
      }
    } catch (err) {
      // Do nothing for now
    }
  }, [map, selectedLocationId, locations]);

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
  }, [created, locations]);

  useEffect(() => {
    if (map) {
      const handlePan = (evt: LeafletMouseEvent) => {
        panTo(evt.latlng);
      };
      map.on('click', handlePan);

      map.on('move', updateSelection);

      map.on('moveend', saveBounds);

      map.on('zoomend', saveBounds);

      return () => {
        map.off('click', handlePan);
        map.off('move', updateSelection);
        map.off('moveend', saveBounds);
        map.off('zoomend', saveBounds);
      };
    }
  }, [map, selectedLocationId, locations, panTo, updateSelection]);

  useEffect(() => {
    if (map && !zoomed) {
      const bounds = localStorageBounds
        ? new LatLngBounds(localStorageBounds)
        : reactFGref.current?.getBounds();

      if (bounds?.isValid()) {
        map.fitBounds(bounds);
        setZoomed(true);
      }
    }
  }, [areas, map]);

  const outerBounds: [number, number][] = [
    [90, -180],
    [90, 180],
    [-90, 180],
    [-90, -180],
  ];

  function getMaskLayer(areas: ZetkinArea[]) {
    const maskPositions: LatLngExpression[][] = [
      outerBounds,
      ...areas.map((area) => area.points as LatLngExpression[]),
    ];
    return maskPositions;
  }

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
            opacity: !selectedLocationId ? 1 : 0.3,
          }}
        >
          {!selectedLocationId && isCreating && (
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
        ref={setMap}
        attributionControl={false}
        minZoom={1}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer
          attribution="<span style='color:#a3a3a3;'>Leaflet & OpenStreetMap</span>"
          url={env.vars.TILESERVER + '/{z}/{x}/{y}.png'}
        />
        <Pane name="blendedPane" style={{ mixBlendMode: 'color-burn' }} />
        <Polygon
          fillColor="black"
          fillOpacity={0.3}
          positions={getMaskLayer(areas)}
          stroke={false}
        />
        <FeatureGroup
          ref={(fgRef) => {
            reactFGref.current = fgRef;
          }}
        >
          {areas.map((area) => (
            <Polygon
              key={area.id}
              color="#A8A8A8"
              fillColor="#A8A8A8"
              fillOpacity={0.5}
              pane="blendedPane"
              pathOptions={{
                color: theme.palette.common.black,
                opacity: 0.5,
                weight: 4,
              }}
              positions={area.points}
            />
          ))}
        </FeatureGroup>
        {locations
          // sort the selectedLocation on top of the others
          .sort((a0, a1) => {
            if (a0.id == selectedLocationId) {
              return 1;
            }
            if (a1.id == selectedLocationId) {
              return -1;
            }
            return 0;
          })
          .map((location) => {
            const selected = location.id == selectedLocationId;
            const key = `marker-${location.id}-${selected.toString()}`;
            const percentage = getVisitPercentage(
              assignment.id,
              location.households,
              assignment.metrics.find((metric) => metric.definesDone)?.id ||
                null
            );
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
                  lat: location.position.lat,
                  lng: location.position.lng,
                }}
              >
                <MarkerIcon
                  percentage={percentage}
                  selected={selected}
                  uniqueKey={key}
                />
              </DivIconMarker>
            );
          })}
      </MapContainer>
      <CanvassMapOverlays
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
              createLocation({
                position: point,
                title,
              });
            }
          }
        }}
        onToggleCreating={(creating) => setIsCreating(creating)}
        selectedLocation={selectedLocation || null}
      />
    </>
  );
};

export default CanvassMap;
