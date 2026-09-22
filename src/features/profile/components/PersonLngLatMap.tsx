import 'maplibre-gl/dist/maplibre-gl.css';

import { Box, BoxProps } from '@mui/material';
import Map, { Marker } from '@vis.gl/react-maplibre';
import { LngLatBounds, Map as MapType } from 'maplibre-gl';
import { FC, useEffect, useMemo, useState } from 'react';

import { useEnv } from 'core/hooks';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import { isLngLatValue } from 'utils/mapUtils';
import { ZetkinCustomField, ZetkinPerson } from 'utils/types/zetkin';
import ZUIMapControls from 'zui/ZUIMapControls';

type Props = {
  height?: BoxProps['height'];
  lngLatFields: ZetkinCustomField[];
  person: ZetkinPerson;
  width?: BoxProps['width'];
};

const PersonLngLatMap: FC<Props> = ({
  lngLatFields,
  height = '100%',
  person,
  width = '100%',
}) => {
  const env = useEnv();
  const [map, setMap] = useState<MapType | null>(null);

  const firstField = lngLatFields[0];
  const firstValue = person[firstField.slug];

  const bounds = useMemo(() => {
    return isLngLatValue(firstValue)
      ? new LngLatBounds(firstValue, firstValue)
      : undefined;
  }, [firstValue]);

  useEffect(() => {
    if (bounds) {
      map?.fitBounds(bounds, {
        animate: true,
        maxZoom: 13,
        speed: 2,
      });
    }
  }, [bounds, map, firstValue]);

  if (bounds) {
    lngLatFields.forEach((field) => {
      const value = person[field.slug];
      if (isLngLatValue(value)) {
        bounds.extend(value);
      }
    });
  }

  return (
    <Box
      sx={{
        height,
        position: 'relative',
        width,
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
        ref={(mapRef) => setMap(mapRef?.getMap() ?? null)}
        initialViewState={{
          latitude: bounds?.getCenter().lat,
          longitude: bounds?.getCenter().lng,
          zoom: 12,
        }}
        mapStyle={env.vars.MAPLIBRE_STYLE}
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        {lngLatFields.map((field) => {
          const fieldValue = person[field.slug];

          if (isLngLatValue(fieldValue)) {
            return (
              <Marker
                key={field.slug}
                anchor="bottom"
                draggable={false}
                latitude={fieldValue.lat}
                longitude={fieldValue.lng}
                offset={[0, 6]}
              >
                <MarkerIcon color="#000000" selected />
              </Marker>
            );
          }
        })}
      </Map>
    </Box>
  );
};

export default PersonLngLatMap;
