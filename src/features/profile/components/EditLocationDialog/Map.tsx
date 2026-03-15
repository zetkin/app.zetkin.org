import 'leaflet/dist/leaflet.css';

import { Map as MapType } from 'leaflet';
import { FC } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

import { useEnv } from 'core/hooks';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import SelectedMarker from 'features/events/components/LocationModal/SelectedMarker';
import { ZetkinLocation } from 'utils/types/zetkin';

interface MapProps {
  onMapClick: (latlng: Pick<ZetkinLocation, 'lat' | 'lng'>) => void;
  initialLocation?: Pick<ZetkinLocation, 'lat' | 'lng'> | null;
  pendingLocation: Pick<ZetkinLocation, 'lat' | 'lng'> | null;
  selectedLocation?: Pick<ZetkinLocation, 'lat' | 'lng'>;
}

const MapWrapper = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

const Map: FC<MapProps> = ({
  onMapClick,
  initialLocation,
  pendingLocation,
}) => {
  const env = useEnv();

  return (
    <MapContainer
      center={
        initialLocation ? [initialLocation.lat, initialLocation.lng] : [0, 0]
      }
      style={{ height: '80vh', width: '100%' }}
      zoom={initialLocation ? 13 : 1}
    >
      <MapWrapper>
        {(map) => {
          if (initialLocation) {
            map.setView({
              lat: initialLocation.lat,
              lng: initialLocation.lng,
            });
          }

          map.on('click', (evt) => {
            const lat = evt.latlng.lat;
            const lng = evt.latlng.lng;

            onMapClick({ lat, lng });
          });

          return (
            <>
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={env.vars.TILESERVER + '/{z}/{x}/{y}.png'}
              />
              {pendingLocation && (
                <DivIconMarker
                  position={[pendingLocation.lat, pendingLocation.lng]}
                >
                  <SelectedMarker />
                </DivIconMarker>
              )}
            </>
          );
        }}
      </MapWrapper>
    </MapContainer>
  );
};

export default Map;
