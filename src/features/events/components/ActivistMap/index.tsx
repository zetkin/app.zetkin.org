import 'leaflet/dist/leaflet.css';
import { latLngBounds, Map } from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

const MapWrapper = ({ children }: { children: (map: Map) => JSX.Element }) => {
  const map = useMap();
  return children(map);
};

const ActivistMap = () => {
  return (
    <MapContainer
      bounds={latLngBounds([
        [75, -170],
        [-60, 180],
      ])}
      style={{ height: '100vh', width: '100%' }}
    >
      <MapWrapper>
        {() => {
          return (
            <>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </>
          );
        }}
      </MapWrapper>
    </MapContainer>
  );
};

export default ActivistMap;
