import { Box } from '@mui/material';
import { Layer, Map, Source } from '@vis.gl/react-maplibre';
import { Map as MapType } from 'maplibre-gl';
import { FC, useCallback, useMemo, useState } from 'react';

import notEmpty from 'utils/notEmpty';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import { markerImage } from '../utils/markerImage';
import { pointsToBounds } from 'utils/mapUtils';
import { ZetkinEventWithStatus } from 'features/home/types';
import { Latitude, Longitude } from 'features/areas/types';
import { getGeoJSONFeaturesAtLocations } from '../../map/utils/locationFiltering';
import useMapMarkerClick from '../hooks/useMapMarkerClick';

export const ActivistPortalEventMap: FC<{
  events: ZetkinEventWithStatus[];
  locationFilter: GeoJSON.Feature[];
  setLocationFilter: (geojsonToFilterBy: GeoJSON.Feature[]) => void;
}> = ({ events, locationFilter, setLocationFilter }) => {
  const [map, setMap] = useState<MapType | null>(null);

  const onMarkerClick = useCallback(
    (geojsonFeatures: GeoJSON.Feature[]) => {
      const bounds = pointsToBounds(
        geojsonFeatures.map((feature) => {
          if (feature.geometry.type === 'Point') {
            return [
              feature.geometry.coordinates[1] as Longitude,
              feature.geometry.coordinates[0] as Latitude,
            ];
          } else {
            return [0 as Longitude, 0 as Latitude];
          }
        })
      );

      if (map && bounds) {
        map.fitBounds(bounds, {
          animate: true,
          duration: 1200,
          maxZoom: 16,
          padding: 20,
        });
      }

      setLocationFilter(geojsonFeatures);
    },
    [map, setLocationFilter]
  );

  useMapMarkerClick(map, onMarkerClick);

  const env = useEnv();
  const bounds = useMemo(
    () =>
      pointsToBounds(
        events
          .map((event) => event.location)
          .filter(notEmpty)
          .map((location) => [location.lng, location.lat])
      ) ?? undefined,
    [events]
  );

  const eventCountByLocation = useMemo(
    () =>
      Object.values(
        events
          .map((event) => event.location)
          .filter(notEmpty)
          .reduce((acc, location) => {
            const key = `${location.lat},${location.lng}`;
            if (!acc[key]) {
              acc[key] = {
                count: 0,
                ...location,
              };
            }
            acc[key].count += 1;
            return acc;
          }, {} as Record<string, { count: number; id: number; lat: Latitude; lng: Longitude }>)
      ),
    [events]
  );

  const locationsGeoJson: GeoJSON.FeatureCollection = useMemo(() => {
    return {
      features:
        eventCountByLocation.map((location) => {
          const features = getGeoJSONFeaturesAtLocations(
            locationFilter,
            location
          );

          const icon = `marker-${location.count}-${
            features.length > 0 ? 'highlight' : 'regular'
          }`;

          return {
            geometry: {
              coordinates: [location.lng, location.lat],
              type: 'Point',
            },
            properties: {
              icon,
              location,
            },
            type: 'Feature',
          };
        }) ?? [],
      type: 'FeatureCollection',
    };
  }, [events, locationFilter]);

  return (
    <Box
      sx={{ flexGrow: 1, height: '100%', position: 'relative', width: '100%' }}
    >
      <ZUIMapControls
        onFitBounds={() => {
          if (map && bounds) {
            map.fitBounds(bounds, {
              animate: true,
              duration: 800,
              padding: 20,
            });
          }
        }}
        onGeolocate={(lngLat) => {
          map?.panTo(lngLat, { animate: true, duration: 800 });
        }}
        onZoomIn={() => map?.zoomIn()}
        onZoomOut={() => map?.zoomOut()}
      />
      <Map
        ref={(map) => setMap(map?.getMap() ?? null)}
        initialViewState={{
          bounds,
          fitBoundsOptions: { padding: 200 },
        }}
        mapStyle={env.vars.MAPLIBRE_STYLE}
        onClick={(ev) => {
          ev.target.panTo(ev.lngLat, { animate: true });
        }}
        onLoad={(ev) => {
          const map = ev.target;

          new Set(eventCountByLocation.map(({ count }) => count)).forEach(
            (count) => {
              map.addImage(
                `marker-${count}-regular`,
                markerImage('#000000', false, count.toString())
              );
              map.addImage(
                `marker-${count}-highlight`,
                markerImage('#000000', true, count.toString())
              );
            }
          );
        }}
        style={{ height: '100%', width: '100%' }}
      >
        <Source data={locationsGeoJson} id="locations" type="geojson">
          <Layer
            id="locationMarkers"
            layout={{
              'icon-allow-overlap': true,
              'icon-image': ['get', 'icon'],
              'icon-offset': [0, -15],
              'symbol-sort-key': ['get', 'z'],
            }}
            source="locations"
            type="symbol"
          />
        </Source>
      </Map>
    </Box>
  );
};
