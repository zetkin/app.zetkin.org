import dynamic from 'next/dynamic';
import { InfoOutlined } from '@mui/icons-material';
import LocationSearch from 'features/events/components/LocationModal/LocationSearch';
import { makeStyles } from '@mui/styles';
import messageIds from 'features/events/l10n/messageIds';
import { scaffold } from 'utils/next';
import { Theme } from '@mui/system';
import useEventActivities from 'features/campaigns/hooks/useEventActivities';
import useEventLocations from 'features/events/hooks/useEventLocations';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import { ACTIVITIES, EventActivity } from 'features/campaigns/types';
import { Box, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

interface StyleProps {
  cardIsFullHeight: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  overlay: {
    bottom: ({ cardIsFullHeight }) => (cardIsFullHeight ? 64 : ''),
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

const ActivistMap = dynamic(
  () => import('features/events/components/ActivistMap'),
  { ssr: false }
);

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  return {
    props: {
      orgId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  locationId?: number | null;
  orgId: string;
};

const Page: FC<PageProps> = ({ orgId, locationId = null }) => {
  const messages = useMessages(messageIds);
  const locations = useEventLocations(parseInt(orgId)) || [];
  const [inMoveState] = useState(false);

  const [searchString, setSearchString] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(locationId);

  const [pendingLocation, setPendingLocation] = useState<Pick<
    ZetkinLocation,
    'lat' | 'lng'
  > | null>(null);

  const { data: activities } = useEventActivities(parseInt(orgId));

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId
  );

  const cardIsFullHeight =
    (!!pendingLocation || !!selectedLocation) && !inMoveState;
  const classes = useStyles({ cardIsFullHeight });

  useEffect(() => {
    setSelectedLocationId(locationId);
    setPendingLocation(null);
  }, [open]);

  if (activities) {
    const events = activities.filter(
      (activity) => activity.kind === ACTIVITIES.EVENT
    ) as EventActivity[];

    return (
      <Box border={1} padding={2}>
        <ActivistMap events={events} />

        <Box className={classes.overlay}>
          <LocationSearch
            onChange={(value: ZetkinLocation) => {
              const location = locations.find(
                (location) => location.id === value.id
              );
              if (!location?.lat || !location?.lng) {
                return;
              }
              setSelectedLocationId(location.id);
              setSearchString(searchString);
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
        </Box>
        <Box alignItems="center" display="flex" paddingTop={1}>
          <InfoOutlined color="secondary" />
          <Typography color="secondary" paddingLeft={1} variant="body2">
            {messages.locationModal.infoText()}
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

export default Page;
