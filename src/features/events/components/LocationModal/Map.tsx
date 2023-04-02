import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import { ZetkinLocation } from 'utils/types/zetkin';
import { icon, latLngBounds } from 'leaflet';

const customIcon = icon({
  iconAnchor: [12, 32],
  iconSize: [25, 32],
  iconUrl: '/selectedMarker.png',
});

interface MapProps {
  locations: ZetkinLocation[];
}

const Map: FC<MapProps> = ({ locations }) => {
  const bounds = latLngBounds(
    locations.map((location) => [location.lat, location.lng])
  );

  return (
    <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          icon={customIcon}
          position={[location.lat, location.lng]}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
