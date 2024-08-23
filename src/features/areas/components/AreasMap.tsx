import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { latLngBounds, Map as MapType } from 'leaflet';

interface MapProps {}

const MapWrapper = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

const Map: FC<MapProps> = () => {
  return (
    <MapContainer
      bounds={latLngBounds([54, 12], [56, 14])}
      style={{ height: '100%', width: '100%' }}
    >
      <MapWrapper>
        {() => {
          return (
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          );
        }}
      </MapWrapper>
    </MapContainer>
  );
};

export default Map;
