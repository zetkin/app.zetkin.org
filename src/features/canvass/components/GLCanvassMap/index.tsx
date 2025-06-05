import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, LngLatLike, Map, Source } from '@vis.gl/react-maplibre';
import { Box } from '@mui/material';
import { GpsNotFixed } from '@mui/icons-material';
import { Map as MapType } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Zetkin2Area } from 'features/areas/types';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import useLocations from 'features/areaAssignments/hooks/useLocations';
import CanvassMapOverlays from '../CanvassMapOverlays';
import MarkerIcon from '../MarkerIcon';
import useCreateLocation from '../../hooks/useCreateLocation';

type Props = {
  areas: Zetkin2Area[];
  assignment: ZetkinAreaAssignment;
};

const GLCanvassMap: FC<Props> = ({ areas, assignment }) => {
  const locations = useLocations(assignment.organization_id, assignment.id);
  const crosshairRef = useRef<HTMLDivElement | null>(null);
  const createLocation = useCreateLocation(assignment.organization_id);

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

    const areaHoles = areas.map((area) =>
      area.boundary.coordinates.flatMap((polygon) =>
        polygon.map(([lat, lng]) => [lng, lat])
      )
    );

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
    const min: LngLatLike = [180, 90];
    const max: LngLatLike = [-180, -90];

    areas.forEach((area) => {
      area.boundary.coordinates.forEach((polygon) => {
        polygon.forEach((point) => {
          const [lat, lng] = point;

          min[0] = Math.min(min[0], lng);
          min[1] = Math.min(min[1], lat);

          max[0] = Math.max(max[0], lng);
          max[1] = Math.max(max[1], lat);
        });
      });
    });

    return [min, max];
  }, [areas]);

  const locationsGeoJson: GeoJSON.GeoJSON = useMemo(() => {
    return {
      features:
        locations.data?.map((location) => ({
          geometry: {
            coordinates: [location.longitude, location.latitude],
            type: 'Point',
          },
          properties: {},
          type: 'Feature',
        })) ?? [],
      type: 'FeatureCollection',
    };
  }, [locations.data]);

  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) {
      return null;
    }

    return locations.data?.find((loc) => loc.id == selectedLocationId) || null;
  }, [locations]);

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
        <Box
          ref={crosshairRef}
          sx={{
            left: '50%',
            opacity: !selectedLocationId ? 1 : 0.3,
            position: 'absolute',
            top: '40vh',
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
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
        onMove={() => updateSelection()}
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
        <Source data={locationsGeoJson} id="locations" type="geojson">
          <Layer id="locationMarkers" source="locations" type="circle" />
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
