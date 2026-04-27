import 'maplibre-gl/dist/maplibre-gl.css';

import { FC, useEffect, useState } from 'react';
import { Map, Marker } from '@vis.gl/react-maplibre';
import { LngLatBounds, MapMouseEvent, Map as MapType } from 'maplibre-gl';
import { Box } from '@mui/material';

import { useEnv } from 'core/hooks';
import { ZetkinLngLatFieldValue } from 'utils/types/zetkin';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import ZUIMapControls from 'zui/ZUIMapControls';
import { Latitude, Longitude } from 'features/areas/types';

interface MapProps {
  onMapClick: (latlng: ZetkinLngLatFieldValue) => void;
  initialLocation?: ZetkinLngLatFieldValue | null;
  pendingLocation?: ZetkinLngLatFieldValue | null;
}

const PersonLocationMap: FC<MapProps> = ({
  onMapClick,
  initialLocation,
  pendingLocation,
}) => {
  const env = useEnv();
  const [map, setMap] = useState<MapType | null>(null);

  let value: ZetkinLngLatFieldValue | null = null;
  if (pendingLocation) {
    value = pendingLocation;
  } else if (initialLocation) {
    value = initialLocation;
  }

  useEffect(() => {
    const handleClick = (ev: MapMouseEvent) => {
      const lat = ev.lngLat.lat;
      const lng = ev.lngLat.lng;

      onMapClick({ lat: lat as Latitude, lng: lng as Longitude });
    };

    map?.on('click', handleClick);

    return () => {
      map?.off('click', handleClick);
    };
  }, [onMapClick, map]);

  const bounds = value ? new LngLatBounds(value, value) : undefined;
  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        width: '100%',
      }}
    >
      <ZUIMapControls
        onFitBounds={() => {
          if (bounds) {
            map?.fitBounds(bounds, {
              animate: true,
              maxZoom: 13,
              speed: 2,
            });
          }
        }}
        onGeolocate={(lngLat) => {
          map?.flyTo({
            animate: true,
            center: lngLat,
            speed: 2,
          });
        }}
        onZoomIn={() => map?.zoomIn()}
        onZoomOut={() => map?.zoomOut()}
      />
      <Map
        ref={(map) => setMap(map?.getMap() ?? null)}
        initialViewState={{
          latitude: bounds?.getCenter().lat,
          longitude: bounds?.getCenter().lng,
          zoom: bounds ? 12 : 1,
        }}
        mapStyle={env.vars.MAPLIBRE_STYLE}
        RTLTextPlugin="/mapbox-gl-rtl-text-0.3.0.js"
        style={{ height: 400, width: '100%' }}
      >
        {value && (
          <Marker
            anchor="bottom"
            draggable={false}
            latitude={value.lat}
            longitude={value.lng}
            offset={[0, 6]}
          >
            <MarkerIcon color="#000000" selected />
          </Marker>
        )}
      </Map>
    </Box>
  );
};

export default PersonLocationMap;
