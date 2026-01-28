import { Layer, Source } from '@vis.gl/react-maplibre';
import { FC, useMemo } from 'react';
import { useTheme } from '@mui/material';

import { Zetkin2Area } from 'features/areas/types';

type Props = {
  areas: Zetkin2Area[];
  dashed?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  outlineColor?: string;
  outlineOpacity?: number;
  outlineWidth?: number;
  style?: 'filled' | 'outlined' | 'hide';
};

const Areas: FC<Props> = ({
  areas,
  dashed = false,
  fillColor,
  fillOpacity = 0.6,
  outlineOpacity = 0.6,
  outlineColor,
  outlineWidth = 2,
  style = 'filled',
}) => {
  const theme = useTheme();
  const areasGeoJson: GeoJSON.GeoJSON = useMemo(() => {
    return {
      features: areas.map((area) => ({
        geometry: area.boundary,
        properties: { id: area.id },
        type: 'Feature',
      })),
      type: 'FeatureCollection',
    };
  }, [areas]);

  if (style === 'hide') {
    return null;
  }

  const strokeColor = outlineColor ?? 'black';
  const fill = fillColor ?? theme.palette.secondary.main;

  return (
    <Source data={areasGeoJson} id="areas" type="geojson">
      <Layer
        id="outlines"
        paint={{
          'line-color': strokeColor,
          'line-dasharray': dashed ? [5, 7] : [1, 0],
          'line-opacity': outlineOpacity,
          'line-width': outlineWidth,
        }}
        type="line"
      />
      {style === 'filled' && (
        <Layer
          id="areas"
          paint={{
            'fill-color': fill,
            'fill-opacity': fillOpacity,
          }}
          type="fill"
        />
      )}
    </Source>
  );
};

export default Areas;
