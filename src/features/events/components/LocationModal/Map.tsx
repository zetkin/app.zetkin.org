import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import { icon } from 'leaflet';
import { ZetkinLocation } from 'utils/types/zetkin';

const customIcon = icon({
  iconAnchor: [12, 32],
  iconSize: [25, 32],
  iconUrl: '/selectedMarker.png',
});

interface MapProps {
  locations: ZetkinLocation[];
}

const Map: FC<MapProps> = ({ locations }) => {
  const lat =
    locations.map((location) => location.lat).reduce((a, b) => a + b) /
    locations.length;
  const lng =
    locations.map((location) => location.lng).reduce((a, b) => a + b) /
    locations.length;

  return (
    <MapContainer
      center={[lat, lng]}
      style={{ height: '100%', width: '100%' }}
      zoom={13}
    >
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
