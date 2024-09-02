import { FC, useState } from 'react';
import { latLngBounds, Map } from 'leaflet';
import { makeStyles } from '@mui/styles';
import { Add, Remove } from '@mui/icons-material';
import { Box, Divider, IconButton, useTheme } from '@mui/material';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';

import { ZetkinArea } from '../types';

const useStyles = makeStyles((theme) => ({
  zoomControls: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    left: 10,
    marginTop: 10,
    position: 'absolute',
    zIndex: 1000,
  },
}));

type PublicAreaMapProps = {
  area: ZetkinArea;
};

const PublicAreaMap: FC<PublicAreaMapProps> = ({ area }) => {
  const theme = useTheme();
  const classes = useStyles();
  const [map, setMap] = useState<Map | null>(null);

  return (
    <>
      {map && (
        <Box className={classes.zoomControls}>
          <IconButton onClick={() => map.zoomIn()}>
            <Add />
          </IconButton>
          <Divider flexItem variant="fullWidth" />
          <IconButton onClick={() => map.zoomOut()}>
            <Remove />
          </IconButton>
        </Box>
      )}
      <MapContainer
        ref={setMap}
        bounds={latLngBounds(area.points)}
        minZoom={1}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon color={theme.palette.primary.main} positions={area.points} />
      </MapContainer>
    </>
  );
};

export default PublicAreaMap;
