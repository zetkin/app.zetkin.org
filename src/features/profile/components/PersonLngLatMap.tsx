import { FC, useState } from 'react';
import { Box, BoxProps } from '@mui/material';
import Map, { Marker } from '@vis.gl/react-maplibre';
import { LngLatBounds, Map as MapType } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  CUSTOM_FIELD_TYPE,
  ZetkinCustomField,
  ZetkinCustomFieldValue,
  ZetkinLngLatFieldValue,
  ZetkinPerson,
} from 'utils/types/zetkin';
import { useEnv } from 'core/hooks';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import ZUIMapControls from 'zui/ZUIMapControls';
import notEmpty from 'utils/notEmpty';

type Props = {
  customFields: ZetkinCustomField[];
  height?: BoxProps['height'];
  person: ZetkinPerson;
  width?: BoxProps['width'];
};

function isLngLatValue(
  value: ZetkinCustomFieldValue
): value is ZetkinLngLatFieldValue {
  return (
    notEmpty(value) &&
    typeof value === 'object' &&
    typeof value['lng'] === 'number' &&
    typeof value['lat'] === 'number'
  );
}

const PersonLngLatMap: FC<Props> = ({
  customFields,
  height = '100%',
  person,
  width = '100%',
}) => {
  const env = useEnv();
  const [map, setMap] = useState<MapType | null>(null);

  const lngLatFields = customFields.filter(
    (field) => field.type === CUSTOM_FIELD_TYPE.LNGLAT
  );
  const lngLatFieldsWithValues = lngLatFields.filter(
    (field) => !!person[field.slug]
  );

  if (lngLatFieldsWithValues.length === 0) {
    return null;
  }

  const firstField = lngLatFieldsWithValues[0];
  const firstValue = person[firstField.slug];

  const bounds = isLngLatValue(firstValue)
    ? new LngLatBounds(firstValue, firstValue)
    : undefined;
  if (bounds) {
    lngLatFieldsWithValues.forEach((field) => {
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
        {lngLatFieldsWithValues.map((field) => {
          const fieldValue = person[field.slug];

          if (isLngLatValue(fieldValue)) {
            return (
              <Marker
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
