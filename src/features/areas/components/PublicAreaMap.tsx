import { FC } from 'react';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import { useTheme } from '@mui/material';

import { ZetkinArea } from '../types';

type PublicAreaMapProps = {
  area: ZetkinArea;
};

const PublicAreaMap: FC<PublicAreaMapProps> = ({ area }) => {
  const theme = useTheme();
  return (
    <MapContainer
      bounds={latLngBounds(area.points)}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon color={theme.palette.primary.main} positions={area.points} />
    </MapContainer>
  );
};

export default PublicAreaMap;
