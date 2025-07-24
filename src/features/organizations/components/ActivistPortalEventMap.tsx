import { Box, SxProps } from '@mui/material';
import { Layer, Map, Source } from '@vis.gl/react-maplibre';
import { Map as MapType } from 'maplibre-gl';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import notEmpty from 'utils/notEmpty';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useAppDispatch, useEnv } from 'core/hooks';
import { markerImage } from '../utils/markerImage';
import { pointsToBounds } from 'utils/mapUtils';
import { ZetkinEventWithStatus } from 'features/home/types';
import { Latitude, Longitude } from 'features/areas/types';
import { filtersUpdated } from '../store';
import { isLocationInGeoJSONFeatures } from '../../map/utils/locationFiltering';

export const ActivistPortalEventMap: FC<
  PropsWithChildren<{
    events: ZetkinEventWithStatus[];
    geojsonToFilterBy: GeoJSON.Feature[];
    sx?: SxProps;
  }>
> = ({ children, events, geojsonToFilterBy, sx }) => {
  const [map, setMap] = useState<MapType | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (map) {
      map.on('click', 'locationMarkers', (event) => {
        if (event.features) {
          const geojsonFeatures = event.features.map((feature) => {
            const location = JSON.parse(feature?.properties?.location);
            return {
              geometry: {
                coordinates: [location.lat, location.lng],
                type: 'Point',
              },
              properties: {
                location,
              },
              type: 'Feature',
            };
          }) as GeoJSON.Feature[];

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

          if (bounds) {
            map.fitBounds(bounds, {
              animate: true,
              duration: 1200,
              maxZoom: 16,
              padding: 20,
            });
          }

          dispatch(
            filtersUpdated({
              geojsonToFilterBy: geojsonFeatures,
            })
          );
        }
      });

      map.on('mouseenter', 'locationMarkers', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'locationMarkers', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  }, [map]);

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
              acc[key] = {
                count: 0,
                ...location,
              };
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
          const isHighlighted = isLocationInGeoJSONFeatures(
            location,
            geojsonToFilterBy
          );

          const icon = `marker-${location.count}-${
            isHighlighted ? 'highlight' : 'regular'
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
      {children}
    </Box>
  );
};
