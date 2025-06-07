import { Map } from 'leaflet';
import { FC } from 'react';

import ZUIMapControls from 'zui/ZUIMapControls';

type MapControlsProps = {
  map: Map | null;
  onFitBounds: () => void;
};

const MapControls: FC<MapControlsProps> = ({ map, onFitBounds }) => {
  return (
    <ZUIMapControls
      onFitBounds={onFitBounds}
      onGeolocate={(latLng) => {
        map?.flyTo(latLng, undefined, {
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
