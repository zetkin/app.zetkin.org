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
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { FC, useState } from 'react';

const useStyles = makeStyles<Theme>(() => ({
  filterLabel: {
    margin: 0,
  },
  filterOverlay: {
    alignItems: 'flex-start',
    background: '#fff',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 4,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'flex-end',
    justifySelf: 'flex-end',
    margin: 2,
    padding: 8,
    position: 'absolute',
    right: 32,
    top: 100,
    zIndex: 1000,
  },
  searchOverlay: {
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
  const [filterNeedParticipants, setFilterNeedParticipants] = useState(false);
  const [filterString, setFilterString] = useState('');

  const { data: activities } = useEventActivities(parseInt(orgId));

  if (activities?.length) {
    const events = activities.filter(
      (activity) => activity.kind === ACTIVITIES.EVENT
    ) as EventActivity[];

    const filters = [
      (event: EventActivity) =>
        filterNeedParticipants
          ? event.data.num_participants_available <
            event.data.num_participants_required
          : true,
      (event: EventActivity) =>
        filterString
          ? !!event.data.activity?.title
              .toLowerCase()
              .match(filterString.toLowerCase())
          : true,
    ];
    const filteredEvents = events.filter((event) =>
      filters.every((filter) => filter(event))
    );

    const locationsWithEvents = groupEventsByLocation(filteredEvents);
    const locations = locationsWithEvents.map(
      (locationGroup) => locationGroup.location
    );

    return (
      <>
        <ActivistMap
          center={center}
          locationsWithEvents={locationsWithEvents}
        />

        <Box className={classes.searchOverlay}>
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

        <Box className={classes.filterOverlay}>
          <div className={classes.filterLabel}>
            <TextField
              label={'Filter'}
              onChange={(e) => {
                setFilterString(e.target.value);
              }}
            />
          </div>

          <FormControlLabel
            className={classes.filterLabel}
            control={
              <Checkbox
                checked={filterNeedParticipants}
                onChange={() => {
                  setFilterNeedParticipants(!filterNeedParticipants);
                }}
                value={'needparticipants'}
              />
            }
            label={'Needs participants'}
          />
        </Box>
      </>
    );
  }
  return null;
};

export default Page;
