import { Layer, Source } from '@vis.gl/react-maplibre';
import { FC, useMemo } from 'react';

import { Zetkin2Area } from 'features/areas/types';
import oldTheme from 'theme';

type Props = {
  areas: Zetkin2Area[];
};

const Areas: FC<Props> = ({ areas }) => {
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

  return (
    <Source data={areasGeoJson} id="areas" type="geojson">
      <Layer
        id="outlines"
        paint={{
          'line-color': oldTheme.palette.secondary.main,
          'line-width': 2,
        }}
        type="line"
      />
      <Layer
        id="areas"
        paint={{
          'fill-color': oldTheme.palette.secondary.main,
          'fill-opacity': 0.4,
        }}
        type="fill"
      />
    </Source>
  );
};

export default Areas;
