import { Layer, Source } from '@vis.gl/react-maplibre';
import { FC } from 'react';

import { Zetkin2AreaLine } from 'features/areas/types';
import oldTheme from 'theme';

type Props = {
  drawingPoints: Zetkin2AreaLine;
};

const DrawingArea: FC<Props> = ({ drawingPoints }) => {
  const drawingGeoJson: GeoJSON.GeoJSON = {
    geometry: {
      coordinates: [drawingPoints],
      type: 'Polygon',
    },
    properties: {},
    type: 'Feature',
  };

  return (
    <Source data={drawingGeoJson} type="geojson">
      <Layer
        id="drawOutlines"
        paint={{
          'line-color': oldTheme.palette.primary.main,
          'line-width': 3,
        }}
        type="line"
      />
      <Layer
        id="drawArea"
        paint={{
          'fill-color': oldTheme.palette.primary.main,
          'fill-opacity': 0.2,
        }}
        type="fill"
      />
      <Layer
        id="anchorPoints"
        paint={{
          'circle-color': oldTheme.palette.primary.main,
          'circle-radius': 8,
        }}
        type="circle"
      />
    </Source>
  );
};

export default DrawingArea;
