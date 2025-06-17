import { Map } from 'leaflet';
import { FC } from 'react';

import flipForLeaflet from 'features/areas/utils/flipForLeaflet';
import ZUIMapControls from 'zui/ZUIMapControls';

type MapControlsProps = {
  map: Map | null;
  onFitBounds: () => void;
};

const MapControls: FC<MapControlsProps> = ({ map, onFitBounds }) => {
  return (
    <ZUIMapControls
      onFitBounds={onFitBounds}
      onGeolocate={(lngLat) => {
        map?.flyTo(flipForLeaflet(lngLat), undefined, {
          animate: true,
          duration: 0.8,
        });
      }}
      onZoomIn={() => map?.zoomIn()}
      onZoomOut={() => map?.zoomOut()}
    />
  );
};

export default MapControls;
