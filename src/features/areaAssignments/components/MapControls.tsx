import { Map } from 'leaflet';
import { FC, useEffect, useState } from 'react';

import flipForLeaflet from 'features/areas/utils/flipForLeaflet';
import ZUIMapControls from 'zui/ZUIMapControls';
import { PointData } from 'features/areas/types';

type MapControlsProps = {
  map: Map | null;
  onFitBounds: () => void;
};

const MapControls: FC<MapControlsProps> = ({ map, onFitBounds }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [userLocation, setUserLocation] = useState<PointData | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }
    const disableFollow = () => setIsFollowing(false);
    map.on('dragstart', disableFollow);
    map.on('zoomstart', disableFollow);
    return () => {
      map.off('dragstart', disableFollow);
      map.off('zoomstart', disableFollow);
    };
  }, [map]);

  return (
    <ZUIMapControls
      isFollowing={isFollowing}
      onFitBounds={onFitBounds}
      onFollowChange={(follow) => {
        setIsFollowing(follow);
        if (follow && userLocation && map) {
          map.flyTo(flipForLeaflet(userLocation), undefined, {
            animate: true,
            duration: 0.4,
          });
        }
      }}
      onGeolocate={(lngLat, _accuracy, tracking) => {
        if (tracking) {
          setUserLocation(lngLat);
          if (isFollowing) {
            map?.flyTo(flipForLeaflet(lngLat), undefined, {
              animate: true,
              duration: 0.4,
            });
          }
        } else {
          setUserLocation(null);
          setIsFollowing(false);
        }
      }}
      onZoomIn={() => map?.zoomIn()}
      onZoomOut={() => map?.zoomOut()}
    />
  );
};

export default MapControls;
