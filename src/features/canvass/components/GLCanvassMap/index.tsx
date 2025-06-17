import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, LngLatLike, Map, Source } from '@vis.gl/react-maplibre';
import { Box } from '@mui/material';
import { GpsNotFixed } from '@mui/icons-material';
import {
  ExpressionSpecification,
  LngLatBounds,
  Map as MapType,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Zetkin2Area } from 'features/areas/types';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import useLocations from 'features/areaAssignments/hooks/useLocations';
import CanvassMapOverlays from '../CanvassMapOverlays';
import MarkerIcon from '../MarkerIcon';
import useCreateLocation from '../../hooks/useCreateLocation';
import oldTheme from 'theme';
import MarkerImageRenderer from './MarkerImageRenderer';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import ClusterImageRenderer from './ClusterImageRenderer';

type Props = {
  areas: Zetkin2Area[];
  assignment: ZetkinAreaAssignment;
};

const GLCanvassMap: FC<Props> = ({ areas, assignment }) => {
  const env = useEnv();
  const locations = useLocations(assignment.organization_id, assignment.id);
  const crosshairRef = useRef<HTMLDivElement | null>(null);
  const createLocation = useCreateLocation(assignment.organization_id);
  const [localStorageBounds, setLocalStorageBounds] = useLocalStorage<
    [LngLatLike, LngLatLike] | null
  >(`mapBounds-${assignment.id}`, null);

  const [created, setCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [map, setMap] = useState<MapType | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );

  const areasGeoJson: GeoJSON.GeoJSON = useMemo(() => {
    const earthCover = [
      [180, 90],
      [180, -90],
      [-180, -90],
      [-180, 90],
      [180, 90],
    ];

    const areaHoles = areas.map((area) => area.boundary.coordinates[0]);

    return {
      geometry: {
        coordinates: [earthCover, ...areaHoles],
        type: 'Polygon',
      },
      properties: {},
      type: 'Feature',
    };
  }, [areas]);

  const bounds: [LngLatLike, LngLatLike] = useMemo(() => {
    if (localStorageBounds) {
      return localStorageBounds;
    }

    const firstPolygon = areas[0]?.boundary.coordinates[0];
    if (firstPolygon.length) {
      const totalBounds = new LngLatBounds(firstPolygon[0], firstPolygon[0]);

      // Extend with all areas
      areas.forEach((area) => {
        area.boundary.coordinates[0]?.forEach((lngLat) =>
          totalBounds.extend(lngLat)
        );
      });

      return [totalBounds.getSouthWest(), totalBounds.getNorthEast()];
    }

    const min: LngLatLike = [180, 90];
    const max: LngLatLike = [-180, -90];

    return [min, max];
  }, [areas]);

  const locationsGeoJson: GeoJSON.FeatureCollection = useMemo(() => {
    return {
      features:
        locations.data?.map((location) => {
          const selected = location.id == selectedLocationId;
          const successfulVisits =
            location?.num_households_successful ||
            location?.num_successful_visits ||
            0;
          const totalHouseholds = Math.max(
            location?.num_estimated_households ?? 0,
            location?.num_known_households ?? 0
          );
          const totalVisits =
            location?.num_households_visited || location?.num_visits || 0;

          let visitRatio = 0;
          let successRatio = 0;

          if (totalHouseholds > 0) {
            visitRatio = totalVisits / totalHouseholds;
            successRatio = successfulVisits / totalHouseholds;
          } else if (totalVisits > 0) {
            visitRatio = 1;
            successRatio = successfulVisits / totalVisits;
          }

          const visitPercentage = Math.round(visitRatio * 10) * 10;
          const successPercentage = Math.round(successRatio * 10) * 10;
          const icon =
            `marker-${successPercentage}-${visitPercentage}` +
            (selected ? '-selected' : '');

          const renderOnTop = selected;

          return {
            geometry: {
              coordinates: [location.longitude, location.latitude],
              type: 'Point',
            },
            properties: {
              icon,
              successPercentage,
              visitPercentage,
              z: renderOnTop ? 1 : 0,
            },
            type: 'Feature',
          };
        }) ?? [],
      type: 'FeatureCollection',
    };
  }, [locations.data]);

  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) {
      return null;
    }

    return locations.data?.find((loc) => loc.id == selectedLocationId) || null;
  }, [locations]);

  const saveBounds = () => {
    const bounds = map?.getBounds();

    if (bounds) {
      setLocalStorageBounds([
        [bounds.getWest(), bounds.getSouth()],
        [bounds.getEast(), bounds.getNorth()],
      ]);
    }
  };

  const updateSelection = useCallback(() => {
    let nearestLocation: number | null = null;
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

        locations.data?.forEach((location) => {
          const screenPos = map.project([
            location.longitude,
            location.latitude,
          ]);
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

  useEffect(() => {
    if (created) {
      updateSelection();
    }
  }, [created, locations]);

  if (!locations.data) {
    return null;
  }

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <ZUIMapControls
          onFitBounds={() => {
            if (map) {
              const firstPolygon = areas[0]?.boundary.coordinates[0];
              if (firstPolygon.length) {
                const totalBounds = new LngLatBounds(
                  firstPolygon[0],
                  firstPolygon[0]
                );

                // Extend with all areas
                areas.forEach((area) => {
                  area.boundary.coordinates[0]?.forEach((lngLat) =>
                    totalBounds.extend(lngLat)
                  );
                });

                if (totalBounds) {
                  map.fitBounds(totalBounds, { animate: true, duration: 800 });
                }
              }
            }
          }}
          onGeolocate={(lngLat) => {
            map?.panTo(lngLat, { animate: true, duration: 800 });
          }}
          onZoomIn={() => map?.zoomIn()}
          onZoomOut={() => map?.zoomOut()}
        />
        <Box
          ref={crosshairRef}
          sx={{
            left: '50%',
            opacity: !selectedLocationId ? 1 : 0.3,
            position: 'absolute',
            top: 'calc(50vh - 40px)',
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.1s',
            zIndex: 1200,
          }}
        >
          {!selectedLocationId && isCreating && (
            <Box
              sx={{
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
                animationDirection: 'alternate',
                animationDuration: '0.4s',
                animationIterationCount: 'infinite',
                animationName: 'ghostMarkerBounce',
                animationTimingFunction: 'cubic-bezier(0,.71,.56,1)',
                opacity: 1,
                position: 'absolute',
                transition: `opacity  0.8s`,
                zIndex: 1000,
              }}
            >
              <MarkerIcon selected={true} />
            </Box>
          )}
          <GpsNotFixed />
        </Box>
      </Box>
      <Map
        ref={(map) => setMap(map?.getMap() ?? null)}
        initialViewState={{
          bounds,
        }}
        mapStyle={env.vars.MAPLIBRE_STYLE}
        onClick={(ev) => {
          ev.target.panTo(ev.lngLat, { animate: true });
        }}
        onLoad={(ev) => {
          const map = ev.target;
          const percentages = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

          percentages.forEach((visitPercentage, visitIndex) => {
            const successPercentages = percentages.slice(0, visitIndex + 1);
            successPercentages.forEach((successPercentage) => {
              map.addImage(
                `marker-${successPercentage}-${visitPercentage}`,
                new MarkerImageRenderer(
                  successPercentage,
                  visitPercentage,
                  false,
                  oldTheme.palette.primary.main
                )
              );
              map.addImage(
                `marker-${successPercentage}-${visitPercentage}-selected`,
                new MarkerImageRenderer(
                  successPercentage,
                  visitPercentage,
                  true,
                  oldTheme.palette.primary.main
                )
              );
              map.addImage(
                `cluster-${successPercentage}-${visitPercentage}`,
                new ClusterImageRenderer(
                  successPercentage,
                  visitPercentage,
                  oldTheme.palette.primary.main
                )
              );
            });
          });
        }}
        onMove={() => updateSelection()}
        onMoveEnd={() => saveBounds()}
        style={{ height: '100%', width: '100%' }}
      >
        <Source data={areasGeoJson} id="areas" type="geojson">
          <Layer
            id="areaFill"
            paint={{ 'fill-color': '#000', 'fill-opacity': 0.4 }}
            source="areas"
            type="fill"
          />
        </Source>
        <Source
          cluster
          clusterMaxZoom={14}
          clusterProperties={{
            successPercentage: ['+', ['get', 'successPercentage']],
            visitPercentage: ['+', ['get', 'visitPercentage']],
          }}
          clusterRadius={50}
          data={locationsGeoJson}
          id="locations"
          type="geojson"
        >
          <Layer
            filter={['!=', 'cluster', true]}
            id="locationMarkers"
            layout={{
              'icon-allow-overlap': true,
              'icon-image': ['get', 'icon'],
              'icon-offset': [0, -15],
              'symbol-sort-key': ['get', 'z'],
            }}
            type="symbol"
          />
          <Layer
            filter={['==', 'cluster', true]}
            id="clusterMarkers"
            layout={{
              'icon-allow-overlap': true,
              'icon-image': [
                'concat',
                'cluster-',
                [
                  'to-string',
                  expressionToRoundAveragePercentage('successPercentage'),
                ],
                '-',
                [
                  'to-string',
                  expressionToRoundAveragePercentage('visitPercentage'),
                ],
              ],
              'icon-offset': [0, 0],
            }}
            type="symbol"
          />
          <Layer
            filter={['==', 'cluster', true]}
            id="clusterLabels"
            layout={{
              'text-field': [
                'concat',
                [
                  'to-string',
                  [
                    'round',
                    [
                      '/',
                      ['number', ['get', 'visitPercentage']],
                      ['get', 'point_count'],
                    ],
                  ],
                ],
                ['literal', '%'],
              ],
              'text-size': 13,
            }}
            paint={{
              'text-color': [
                'case',
                ['>', ['get', 'visitPercentage'], 0],
                '#000000',
                '#888888',
              ],
            }}
            type="symbol"
          />
        </Source>
      </Map>
      <CanvassMapOverlays
        assignment={assignment}
        isCreating={isCreating}
        onCreate={(title) => {
          const crosshair = crosshairRef.current;

          if (crosshair && map) {
            const markerPos = getCrosshairPositionOnMap(map, crosshair);

            const point = map.unproject([markerPos.markerX, markerPos.markerY]);

            if (point) {
              setCreated(true);
              createLocation({
                latitude: point.lat,
                longitude: point.lng,
                title,
              });
            }
          }
        }}
        onToggleCreating={(creating) => setIsCreating(creating)}
        selectedLocation={selectedLocation}
      />
    </>
  );
};

export default GLCanvassMap;

type Marker = {
  markerX: number;
  markerY: number;
};

const getCrosshairPositionOnMap = (
  map: MapType,
  crosshair: HTMLDivElement
): Marker => {
  const mapContainer = map.getContainer();
  const markerRect = crosshair.getBoundingClientRect();
  const mapRect = mapContainer.getBoundingClientRect();
  const x = markerRect.x - mapRect.x;
  const y = markerRect.y - mapRect.y;
  const markerX = x + 0.5 * markerRect.width;
  const markerY = y + 0.5 * markerRect.height;

  return { markerX, markerY };
};

function expressionToRoundAveragePercentage(
  percentagePropName: string
): ExpressionSpecification {
  return [
    '*',
    10,
    [
      'round',
      ['/', ['/', ['get', percentagePropName], ['get', 'point_count']], 10],
    ],
  ];
}
