import { FC, useRef } from 'react';
import { latLngBounds, Map } from 'leaflet';
import { makeStyles } from '@mui/styles';
import { Add, Remove } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, useTheme } from '@mui/material';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';

import { ZetkinArea } from '../types';
import useAreaMutations from '../hooks/useAreaMutations';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

const useStyles = makeStyles((theme) => ({
  counter: {
    bottom: 15,
    display: 'flex',
    gap: 8,
    padding: 8,
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
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
  const mapRef = useRef<Map | null>(null);
  const { updateArea } = useAreaMutations(area.organization.id, area.id);

  return (
    <>
      <Box className={classes.zoomControls}>
        <IconButton onClick={() => mapRef.current?.zoomIn()}>
          <Add />
        </IconButton>
        <Divider flexItem variant="fullWidth" />
        <IconButton onClick={() => mapRef.current?.zoomOut()}>
          <Remove />
        </IconButton>
      </Box>
      <Box className={classes.counter}>
        <Button
          fullWidth
          onClick={() =>
            updateArea({
              numberOfActions: area.numberOfActions + 1,
            })
          }
          variant="contained"
        >
          <Msg id={messageIds.activityCounter.button} />
        </Button>
        <Box bgcolor="white" padding={1}>
          {area.numberOfActions}
        </Box>
      </Box>
      <MapContainer
        ref={mapRef}
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
