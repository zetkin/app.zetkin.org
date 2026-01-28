import { InfoOutlined } from '@mui/icons-material';
import { Box, Dialog, Typography } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';

import CreateLocationCard from './CreateLocationCard';
import LocationDetailsCard from './LocationDetailsCard';
import LocationSearch from './LocationSearch';
import messageIds from 'features/events/l10n/messageIds';
import MoveLocationCard from './MoveLocationCard';
import useEventLocationMutations from 'features/events/hooks/useEventLocationMutations';
import { useMessages } from 'core/i18n';
import { ZetkinEvent, ZetkinLocation } from 'utils/types/zetkin';
import LocationModalMap from 'features/events/components/LocationModal/LocationModalMap';

export type PendingLocation = {
  lat: number;
  lng: number;
};

interface LocationModalProps {
  currentEvent?: ZetkinEvent;
  events: ZetkinEvent[];
  locations: ZetkinLocation[];
  onCreateLocation: (
    newLocation: Partial<ZetkinLocation>
  ) => Promise<ZetkinLocation>;
  onMapClose: () => void;
  onSelectLocation: (location: ZetkinLocation) => void;
  open: boolean;
  orgId: number;
  locationId?: number | null;
}

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
  const [selectedLocationId, setSelectedLocationId] = useState(locationId);
  const { setLocationLatLng } = useEventLocationMutations(orgId);
  const [pendingLocation, setPendingLocation] = useState<
    | (Pick<ZetkinLocation, 'lat' | 'lng'> &
        Partial<Pick<ZetkinLocation, 'title' | 'info_text'>>)
    | null
  >(null);
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

  const onMarkerClick = useCallback(
    (locationId: number) => {
      const location = locations.find((location) => location.id === locationId);
      if (!location?.lat || !location?.lng) {
        return;
      }
      setPendingLocation(null);
      setSelectedLocationId(location.id);
    },
    [locations]
  );

  return (
    <Dialog fullWidth maxWidth="lg" onClose={onMapClose} open={open}>
      <Box padding={2}>
        <LocationModalMap
          inMoveState={inMoveState}
          locations={locations}
          onMapClick={(latlng: PendingLocation) => {
            setSelectedLocationId(null);
            setPendingLocation(latlng);
          }}
          onMarkerClick={onMarkerClick}
          onMarkerDragEnd={(lat: number, lng: number) =>
            setNewLatLng({ lat, lng })
          }
          pendingLocation={pendingLocation}
          selectedLocation={selectedLocation}
          setPendingLocation={setPendingLocation}
          setSelectedLocationId={setSelectedLocationId}
        />
        <Box
          sx={{
            bottom: cardIsFullHeight ? '64px' : '',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            justifySelf: 'flex-end',
            margin: '2px',
            pointerEvents: 'none',
            position: 'absolute',
            right: '32px',
            top: '32px',
            zIndex: 1000,
          }}
        >
          <LocationSearch
            onChange={(value: ZetkinLocation) => {
              if (value.id === -1) {
                setSelectedLocationId(null);
                setPendingLocation({
                  info_text: value.info_text,
                  lat: value.lat,
                  lng: value.lng,
                  title: value.title,
                });
                return;
              }

              const location = locations.find(
                (location) => location.id === value.id
              );
              if (!location?.lat || !location?.lng) {
                return;
              }
              setSelectedLocationId(location.id);
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
            options={locations}
          />
          {selectedLocation && !inMoveState && (
            <LocationDetailsCard
              location={selectedLocation}
              onClose={() => {
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
                onCreateLocation(newLocation).then((location) =>
                  setSelectedLocationId(location.id)
                );
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
