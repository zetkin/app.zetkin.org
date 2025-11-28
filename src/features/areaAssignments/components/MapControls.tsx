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
        map?.panTo(flipForLeaflet(lngLat), {
          animate: true,
        });
      }}
      onZoomIn={() => map?.zoomIn()}
      onZoomOut={() => map?.zoomOut()}
    />
  );
};

export default MapControls;
