import { Box, SxProps } from '@mui/material';
import { Layer, Map, Source } from '@vis.gl/react-maplibre';
import { Map as MapType } from 'maplibre-gl';
import { FC, PropsWithChildren, useMemo, useState } from 'react';

import notEmpty from 'utils/notEmpty';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import { markerImage } from '../utils/markerImage';
import { pointsToBounds } from 'utils/mapUtils';
import { ZetkinEventWithStatus } from 'features/home/types';
import { Latitude, Longitude } from 'features/areas/types';

export const ActivistPortalEventMap: FC<
  PropsWithChildren<{
    events: ZetkinEventWithStatus[];
    sx?: SxProps;
  }>
> = ({ children, events, sx }) => {
  const [map, setMap] = useState<MapType | null>(null);

  const env = useEnv();
  const bounds = useMemo(
    () =>
      pointsToBounds(
        events
          .map((event) => event.location)
          .filter(notEmpty)
          .map((location) => [
            location.lng as Longitude,
            location.lat as Latitude,
          ])
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
              acc[key] = { count: 0, lat: location.lat, lng: location.lng };
            }
            acc[key].count += 1;
            return acc;
          }, {} as Record<string, { count: number; lat: number; lng: number }>)
      ),
    [events]
  );

  const locationsGeoJson: GeoJSON.FeatureCollection = useMemo(() => {
    return {
      features:
        eventCountByLocation.map((location) => {
          const icon = `marker-${location.count}`;

          return {
            geometry: {
              coordinates: [location.lng, location.lat],
              type: 'Point',
            },
            properties: {
              icon,
            },
            type: 'Feature',
          };
        }) ?? [],
      type: 'FeatureCollection',
    };
  }, [events]);

  return (
    <Box
      sx={{ flexGrow: 1, height: '100px', position: 'relative', ...(sx ?? {}) }}
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
                `marker-${count}`,
                markerImage('#000000', count.toString())
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
      {children}
    </Box>
  );
};
