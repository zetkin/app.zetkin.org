import { Layer, Source } from '@vis.gl/react-maplibre';
import { FC, useMemo } from 'react';

import { Zetkin2Area, Zetkin2AreaLine } from 'features/areas/types';
import oldTheme from 'theme';

type Props = {
  draggingPoints: Zetkin2AreaLine | null;
  editingArea: Zetkin2Area | null;
  selectedArea: Zetkin2Area;
};

const SelectedArea: FC<Props> = ({
  draggingPoints,
  editingArea,
  selectedArea,
}) => {
  const selectedAreaGeoJson: GeoJSON.GeoJSON = useMemo(() => {
    if (draggingPoints) {
      return {
        geometry: { coordinates: [draggingPoints], type: 'Polygon' },
        properties: { id: selectedArea.id },
        type: 'Feature',
      };
    } else {
      return {
        geometry: editingArea ? editingArea.boundary : selectedArea.boundary,
        properties: { id: selectedArea.id },
        type: 'Feature',
      };
    }
  }, [selectedArea, draggingPoints, editingArea]);

  return (
    <Source data={selectedAreaGeoJson} type="geojson">
      <Layer
        id="selectedOutlines"
        paint={{
          'line-color': oldTheme.palette.primary.main,
          'line-width': 3,
        }}
        type="line"
      />
      <Layer
        id="selectedArea"
        paint={{
          'fill-color': oldTheme.palette.primary.main,
          'fill-opacity': 0.6,
        }}
        type="fill"
      />
      {!!editingArea && (
        <Layer
          id="editPoints"
          paint={{
            'circle-color': oldTheme.palette.primary.main,
            'circle-radius': 8,
          }}
          type="circle"
        />
      )}
    </Source>
  );
};

export default SelectedArea;
