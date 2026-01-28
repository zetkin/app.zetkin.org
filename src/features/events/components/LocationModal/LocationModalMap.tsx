import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box } from '@mui/material';
import { Layer, Map, Source } from '@vis.gl/react-maplibre';
import { Map as MapType, MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GeoJSON } from 'geojson';

import { ZetkinLocation } from 'utils/types/zetkin';
import { useEnv } from 'core/hooks';
import { pointsToBounds } from 'utils/mapUtils';
import {
  asLatitude,
  asLongitude,
} from 'features/areas/utils/asLongitudeLatitude';
import ZUIMapControls from 'zui/ZUIMapControls';
import { markerImage } from 'features/organizations/utils/markerImage';
import useMapMarkerClick from 'features/organizations/hooks/useMapMarkerClick';
import { Latitude, Longitude } from 'features/areas/types';
import useMapMarkerDrag from 'features/events/hooks/useMapMarkerDrag';

interface MapProps {
  inMoveState: boolean;
  locations: ZetkinLocation[];
  onMapClick: (latlng: Pick<ZetkinLocation, 'lat' | 'lng'>) => void;
  onMarkerClick: (locationId: number) => void;
  onMarkerDragEnd: (lat: number, lng: number) => void;
  pendingLocation: Pick<ZetkinLocation, 'lat' | 'lng'> | null;
  selectedLocation?: ZetkinLocation;
  setPendingLocation: Dispatch<
    SetStateAction<Pick<ZetkinLocation, 'lat' | 'lng'> | null>
  >;
  setSelectedLocationId: Dispatch<SetStateAction<number | null>>;
}

const LocationModalMap: FC<MapProps> = ({
  inMoveState,
  locations,
  onMapClick,
  onMarkerClick,
  onMarkerDragEnd,
  pendingLocation,
  selectedLocation,
  setPendingLocation,
  setSelectedLocationId,
}) => {
  const [map, setMap] = useState<MapType | null>(null);

  const { dragPosition } = useMapMarkerDrag({
    inMoveState,
    layerId: 'locationMarkers',
    map,
    onDragEnd: onMarkerDragEnd,
    selectedLocation,
  });

  const env = useEnv();

  //if org doesn't have locations, show whole world
  const bounds = useMemo(
    () =>
      locations.length > 0
        ? pointsToBounds(
            locations.map((location) => [
              asLongitude(location.lng),
              asLatitude(location.lat),
            ])
          ) ?? undefined
        : pointsToBounds([
            [asLongitude(-170), asLatitude(75)],
            [asLongitude(180), asLatitude(-60)],
          ]) ?? undefined,
    [locations]
  );

  const onMarkerClickGeoJson = useCallback(
    (geojsonFeatures: GeoJSON.Feature[], ev: MapMouseEvent) => {
      if (geojsonFeatures.length === 0) {
        map?.panTo(ev.lngLat, { animate: true });
        return;
      }

      if (geojsonFeatures.length === 1) {
        const feature = geojsonFeatures[0];

        if (!feature.properties?.location) {
          return;
        }

        map?.panTo(ev.lngLat, { animate: true });
        onMarkerClick(feature.properties?.location?.id);
        return;
      }

      const bounds = pointsToBounds(
        geojsonFeatures
          .map((feature) => {
            if (feature.geometry.type !== 'Point') {
              return null;
            }

            return [
              asLongitude(feature.geometry.coordinates[1]),
              asLatitude(feature.geometry.coordinates[0]),
            ] as [Longitude, Latitude];
          })
          .filter((point) => !!point)
      );

      if (!bounds) {
        ev.target.panTo(ev.lngLat, { animate: true });
        return;
      }

      map?.fitBounds(bounds, {
        animate: true,
        duration: 800,
        maxZoom: 18,
        padding: 80,
      });
    },
    [map, onMarkerClick]
  );

  useMapMarkerClick(map, onMarkerClickGeoJson);

  useEffect(() => {
    if (!selectedLocation && !pendingLocation) {
      return;
    }
    map?.panTo(selectedLocation || pendingLocation!, {
      animate: true,
    });
  }, [map, selectedLocation, pendingLocation]);

  const locationsGeoJson: GeoJSON.FeatureCollection = useMemo(() => {
    const features =
      locations.map((location) => {
        const isSelectedMarker = selectedLocation?.id == location.id;

        const icon = `marker-${isSelectedMarker ? 'highlight' : 'regular'}`;

        const effectiveLocation =
          isSelectedMarker && dragPosition ? dragPosition : location;

        return {
          geometry: {
            coordinates: [effectiveLocation.lng, effectiveLocation.lat],
            type: 'Point' as const,
          },
          properties: {
            icon,
            location,
          },
          type: 'Feature' as const,
        };
      }) ?? [];

    if (pendingLocation) {
      features.push({
        geometry: {
          coordinates: [pendingLocation.lng, pendingLocation.lat],
          type: 'Point' as const,
        },
        properties: {
          icon: 'marker-highlight',
          location: {
            id: 0,
            info_text: '',
            title: '',
            ...pendingLocation,
          },
        },
        type: 'Feature' as const,
      });
    }

    return {
      features: features,
      type: 'FeatureCollection',
    };
  }, [locations, selectedLocation?.id, pendingLocation, dragPosition]);

  return (
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
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
          const map = ev.target;

          const features = map.queryRenderedFeatures(ev.point, {
            layers: ['locationMarkers'],
          });

          if (features.length > 0) {
            return;
          }

          if (pendingLocation) {
            setPendingLocation(null);
            return;
          }

          if (selectedLocation) {
            setSelectedLocationId(null);
            return;
          }

          ev.target.panTo(ev.lngLat, { animate: true });
          const lat = ev.lngLat.lat;
          const lng = ev.lngLat.lng;
          onMapClick({ lat, lng });
        }}
        onLoad={(ev) => {
          const map = ev.target;
          map.addImage('marker-regular', markerImage('#000000', false));
          map.addImage('marker-highlight', markerImage('#000000', true));
        }}
        style={{ height: '80vh', width: '100%' }}
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

export default LocationModalMap;
