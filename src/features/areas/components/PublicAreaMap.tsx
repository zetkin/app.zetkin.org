import { FC, useRef, useState } from 'react';
import { latLngBounds, Map } from 'leaflet';
import { makeStyles } from '@mui/styles';
import { Add, Remove } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { MapContainer, Polygon, TileLayer } from 'react-leaflet';

import { ZetkinArea } from '../types';
import useAreaMutations from '../hooks/useAreaMutations';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';

const useStyles = makeStyles((theme) => ({
  areaNumber: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '2em',
    display: 'flex',
    height: 30,
    justifyContent: 'center',
    transform: 'translate(-20%, -60%)',
    width: 30,
  },
  counter: {
    bottom: 15,
    display: 'flex',
    gap: 8,
    padding: 8,
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
  markerNumber: {
    bottom: -14,
    color: 'blue',
    left: '100%',
    position: 'absolute',
    textAlign: 'center',
    transform: 'translate(-50%)',
    zIndex: 2000,
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
  const [mode, setMode] = useState<'area' | 'markers'>('area');
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
        <ToggleButtonGroup
          color="primary"
          exclusive
          onChange={(ev, newMode) => {
            if (newMode != null) {
              setMode(newMode);
            }
          }}
          sx={{ backgroundColor: theme.palette.background.default }}
          value={mode}
        >
          <ToggleButton value="area">Area</ToggleButton>
          <ToggleButton value="markers">Markers</ToggleButton>
        </ToggleButtonGroup>
        <ButtonGroup fullWidth>
          <Button
            disabled={area.numberOfActions == 0}
            onClick={() => {
              if (area.numberOfActions > 0) {
                updateArea({
                  numberOfActions: area.numberOfActions - 1,
                });
              }
            }}
            sx={{ width: '20%' }}
            variant="contained"
          >
            <Remove />
          </Button>
          <Button
            onClick={() =>
              updateArea({
                numberOfActions: area.numberOfActions + 1,
              })
            }
            variant="contained"
          >
            <Msg id={messageIds.activityCounter.button} />
          </Button>
        </ButtonGroup>
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
        {mode == 'area' && (
          <DivIconMarker position={latLngBounds(area.points).getCenter()}>
            <Box className={classes.areaNumber}>{area.numberOfActions}</Box>
          </DivIconMarker>
        )}
        {mode == 'markers' && (
          <>
            {area.markers.map((marker, index) => (
              <DivIconMarker
                key={`marker-${index}`}
                iconAnchor={[11, 33]}
                position={{
                  lat: marker.position.lat,
                  lng: marker.position.lng,
                }}
              >
                <Box className={classes.markerNumber}>
                  <Typography>{marker.numberOfActions}</Typography>
                </Box>
                <svg fill="none" height="35" viewBox="0 0 30 40" width="25">
                  <path
                    d="M14 38.479C13.6358 38.0533 13.1535 37.4795
           12.589 36.7839C11.2893 35.1826 9.55816 32.9411
            7.82896 30.3782C6.09785 27.8124 4.38106 24.9426
            3.1001 22.0833C1.81327 19.211 1 16.4227 1 14C1
            6.81228 6.81228 1 14 1C21.1877 1 27 6.81228 27 14C27
            16.4227 26.1867 19.211 24.8999 22.0833C23.6189 24.9426
            21.9022 27.8124 20.171 30.3782C18.4418 32.9411 16.7107
            35.1826 15.411 36.7839C14.8465 37.4795 14.3642
            38.0533 14 38.479Z"
                    fill="white"
                    stroke="#ED1C55"
                    strokeWidth="2"
                  />
                </svg>
              </DivIconMarker>
            ))}
          </>
        )}
      </MapContainer>
    </>
  );
};

export default PublicAreaMap;
