import dynamic from 'next/dynamic';
import { InfoOutlined } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/system';
import { Box, Dialog, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import CreateLocationCard from './CreateLocationCard';
import LocationDetailsCard from './LocationDetailsCard';
import LocationSearch from './LocationSearch';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';

interface StyleProps {
  pendingLocation?: PendingLocation;
  selectedLocation?: ZetkinLocation;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  overlay: {
    bottom: ({ pendingLocation, selectedLocation }) =>
      pendingLocation || selectedLocation ? 64 : '',
    display: 'flex',
    justifyContent: 'flex-end',
    justifySelf: 'flex-end',
    margin: 2,
    position: 'absolute',
    right: 32,
    top: 32,
    width: '30%',
    zIndex: 1000,
  },
}));

type PendingLocation = {
  lat: number;
  lng: number;
};

interface LocationModalProps {
  locations: ZetkinLocation[];
  onMapClose: () => void;
  onSelectLocation: (location: ZetkinLocation) => void;
  open: boolean;
  locationId?: number;
}

const Map = dynamic(() => import('./Map'), { ssr: false });
const LocationModal: FC<LocationModalProps> = ({
  locations,
  onMapClose,
  onSelectLocation,
  open,
  locationId,
}) => {
  const messages = useMessages(messageIds);
  const [searchString, setSearchString] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(
    locationId ?? undefined
  );
  const [focusedMarker, setFocusedMarker] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [pendingLocation, setPendingLocation] = useState<
    PendingLocation | undefined
  >();

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId
  );

  const classes = useStyles({ pendingLocation, selectedLocation });

  useEffect(() => {
    setSelectedLocationId(locationId);
    setPendingLocation(undefined);
  }, [open]);

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onMapClose} open={open}>
      <Box padding={2}>
        <Map
          focusedMarker={focusedMarker}
          locations={locations}
          onMapClick={(latlng: PendingLocation) => {
            setSelectedLocationId(undefined);
            setPendingLocation(latlng);
          }}
          onMarkerClick={(locationId: number) => {
            const location = locations.find(
              (location) => location.id === locationId
            );
            if (!location?.lat || !location?.lng) {
              return;
            }
            setSelectedLocationId(location.id);
            setFocusedMarker({ lat: location.lat, lng: location.lng });
          }}
          searchString={searchString}
          selectedLocation={selectedLocation}
        />
        <Box className={classes.overlay}>
          {!selectedLocation && !pendingLocation && (
            <LocationSearch
              onChange={(value: ZetkinLocation) => {
                const location = locations.find(
                  (location) => location.id === value.id
                );
                if (!location?.lat || !location?.lng) {
                  return;
                }
                setFocusedMarker({ lat: location.lat, lng: location.lng });
                setSelectedLocationId(location.id);
                setSearchString('');
              }}
              onInputChange={(value) => setSearchString(value || '')}
              onTextFieldChange={(value) => setSearchString(value)}
              options={locations}
            />
          )}
          {selectedLocation && (
            <LocationDetailsCard
              location={selectedLocation}
              onClose={() => {
                setSearchString('');
                setSelectedLocationId(undefined);
              }}
              onUseLocation={() => {
                onSelectLocation(selectedLocation);
                onMapClose();
              }}
            />
          )}
          {pendingLocation && !selectedLocation && (
            <CreateLocationCard
              onClose={() => {
                setPendingLocation(undefined);
              }}
              onCreateLocation={() => {
                setPendingLocation(undefined);
              }}
            />
          )}
        </Box>
        <Box alignItems="center" display="flex" paddingTop={1}>
          <InfoOutlined color="secondary" />
          <Typography color="secondary" paddingLeft={1} variant="body2">
            {messages.locationModal.infoText()}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LocationModal;
