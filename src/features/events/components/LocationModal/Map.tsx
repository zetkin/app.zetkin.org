import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import { icon } from 'leaflet';

const customIcon = icon({
  iconSize: [25, 32],
  iconUrl: '/selectedMarker.png',
});

const Map = () => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      style={{ height: '100%', width: '100%' }}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={customIcon} position={[51.505, -0.09]} />
    </MapContainer>
  );
};

export default Map;
