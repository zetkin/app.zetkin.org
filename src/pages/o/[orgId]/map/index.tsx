import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import groupEventsByLocation from 'features/events/components/ActivistMap/groupEventsByLocation';
import { LatLngLiteral } from 'leaflet';
import LocationSearch from 'features/events/components/LocationModal/LocationSearch';
import { makeStyles } from '@mui/styles';
import { scaffold } from 'utils/next';
import { Theme } from '@mui/system';
import useEventActivities from 'features/campaigns/hooks/useEventActivities';
import { ZetkinLocation } from 'utils/types/zetkin';
import { ACTIVITIES, EventActivity } from 'features/campaigns/types';
import { FC, useState } from 'react';

const useStyles = makeStyles<Theme>(() => ({
  overlay: {
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
  orgId: string;
};

const Page: FC<PageProps> = ({ orgId }) => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState('');
  const [, setSelectedLocation] = useState<ZetkinLocation | undefined>();
  const [center, setCenter] = useState<LatLngLiteral | undefined>();

  const { data: activities } = useEventActivities(parseInt(orgId));

  if (activities) {
    const events = activities.filter(
      (activity) => activity.kind === ACTIVITIES.EVENT
    ) as EventActivity[];

    const locationsWithEvents = groupEventsByLocation(events);
    const locations = locationsWithEvents.map(
      (locationGroup) => locationGroup.location
    );

    return (
      <>
        <ActivistMap
          center={center}
          locationsWithEvents={locationsWithEvents}
        />

        <Box className={classes.overlay}>
          <LocationSearch
            onChange={(value: ZetkinLocation) => {
              setSearchString(searchString);
              setSelectedLocation(value);
            }}
            onClickGeolocate={() => {
              if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                  // Success getting location
                  (position) => {
                    setCenter({
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
      </>
    );
  }
  return null;
};

export default Page;
