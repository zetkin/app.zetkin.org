import dynamic from 'next/dynamic';
import { InfoOutlined } from '@mui/icons-material';
import { Box, Dialog, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import CreateLocationCard from './CreateLocationCard';
import LocationDetailsCard from './LocationDetailsCard';
import LocationSearch from './LocationSearch';
import messageIds from 'features/events/l10n/messageIds';
import MoveLocationCard from './MoveLocationCard';
import useEventLocationMutations from 'features/events/hooks/useEventLocationMutations';
import { useMessages } from 'core/i18n';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';

export type PendingLocation = {
  lat: number;
  lng: number;
};

interface LocationModalProps {
  currentEvent?: ZetkinEvent;
  events: ZetkinEvent[];
  locations: ZetkinLocation[];
  onCreateLocation: (newLocation: Partial<ZetkinLocation>) => void;
  onMapClose: () => void;
  onSelectLocation: (location: ZetkinLocation) => void;
  open: boolean;
  orgId: number;
  locationId?: number | null;
}

const Map = dynamic(() => import('./Map'), { ssr: false });
const LocationModal: FC<LocationModalProps> = ({
  currentEvent,
  events,
  locations,
  onCreateLocation,
  onMapClose,
  onSelectLocation,
  open,
  orgId,
  locationId = null,
}) => {
  const messages = useMessages(messageIds);
  const [searchString, setSearchString] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(locationId);
  const { setLocationLatLng } = useEventLocationMutations(orgId);
  const [pendingLocation, setPendingLocation] = useState<Pick<
    ZetkinLocation,
    'lat' | 'lng'
  > | null>(null);
  const [inMoveState, setInMoveState] = useState(false);
  const [newLatLng, setNewLatLng] =
    useState<Pick<ZetkinLocation, 'lat' | 'lng'>>();

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId
  );

  const cardIsFullHeight =
    (!!pendingLocation || !!selectedLocation) && !inMoveState;

  useEffect(() => {
    setSelectedLocationId(locationId);
    setPendingLocation(null);
  }, [open]);

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onMapClose} open={open}>
      <Box border={1} padding={2}>
        <Map
          currentEventId={currentEvent?.id || null}
          inMoveState={inMoveState}
          locations={locations}
          onMapClick={(latlng: PendingLocation) => {
            setSelectedLocationId(null);
            setPendingLocation(latlng);
          }}
          onMarkerClick={(locationId: number) => {
            const location = locations.find(
              (location) => location.id === locationId
            );
            if (!location?.lat || !location?.lng) {
              return;
            }
            setPendingLocation(null);
            setSelectedLocationId(location.id);
          }}
          onMarkerDragEnd={(lat: number, lng: number) =>
            setNewLatLng({ lat, lng })
          }
          pendingLocation={pendingLocation}
          relatedEvents={events}
          searchString={searchString}
          selectedLocation={selectedLocation}
        />
        <Box
          sx={{
            bottom: cardIsFullHeight ? '64px' : '',
            display: 'flex',
            justifyContent: 'flex-end',
            justifySelf: 'flex-end',
            margin: '2px',
            position: 'absolute',
            right: '32px',
            top: '32px',
            width: '30%',
            zIndex: 1000,
          }}
        >
          {!selectedLocation && !pendingLocation && (
            <LocationSearch
              onChange={(value: ZetkinLocation) => {
                const location = locations.find(
                  (location) => location.id === value.id
                );
                if (!location?.lat || !location?.lng) {
                  return;
                }
                setSelectedLocationId(location.id);
                setSearchString('');
              }}
              onClickGeolocate={() => {
                if ('geolocation' in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    // Success getting location
                    (position) => {
                      setPendingLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      });
                    }
                  );
                }
              }}
              onInputChange={(value) => setSearchString(value || '')}
              onTextFieldChange={(value) => setSearchString(value)}
              options={locations}
            />
          )}
          {selectedLocation && !inMoveState && (
            <LocationDetailsCard
              location={selectedLocation}
              onClose={() => {
                setSearchString('');
                setSelectedLocationId(null);
              }}
              onMove={() => setInMoveState(true)}
              onUseLocation={() => {
                onSelectLocation(selectedLocation);
                onMapClose();
              }}
              orgId={orgId}
              relatedEvents={events.filter(
                (event) =>
                  event.location?.id === selectedLocation.id &&
                  currentEvent &&
                  event.id !== currentEvent.id
              )}
            />
          )}
          {pendingLocation && !selectedLocation && (
            <CreateLocationCard
              onClose={() => {
                setPendingLocation(null);
              }}
              onCreateLocation={(newLocation: Partial<ZetkinLocation>) => {
                onCreateLocation(newLocation);
                setPendingLocation(null);
              }}
              pendingLocation={pendingLocation}
            />
          )}
          {inMoveState && selectedLocation && !pendingLocation && (
            <MoveLocationCard
              location={selectedLocation}
              onCancel={() => {
                setInMoveState(false);
              }}
              onClose={() => {
                setInMoveState(false);
                setSelectedLocationId(null);
              }}
              onSaveLocation={() => {
                if (newLatLng) {
                  setLocationLatLng(
                    selectedLocation.id,
                    newLatLng.lat,
                    newLatLng.lng
                  );
                }
                setInMoveState(false);
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
