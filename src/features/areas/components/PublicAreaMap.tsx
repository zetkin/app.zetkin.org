import { FC } from 'react';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';
import { latLngBounds } from 'leaflet';

import { ZetkinArea } from '../types';

type PublicAreaMapProps = {
  area: ZetkinArea;
};

const PublicAreaMap: FC<PublicAreaMapProps> = ({ area }) => {
  return (
    <MapContainer
      bounds={latLngBounds(area.points)}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon positions={area.points} />
    </MapContainer>
  );
};

export default PublicAreaMap;
