'use client';

import dayjs from 'dayjs';
import { Box, Fade, SxProps } from '@mui/material';
import { Layer, Map, Source } from '@vis.gl/react-maplibre';
import { Map as MapType } from 'maplibre-gl';
import { FC, PropsWithChildren, useMemo, useState } from 'react';

import useUpcomingOrgEvents from '../hooks/useUpcomingOrgEvents';
import EventListItem from 'features/home/components/EventListItem';
import { ZetkinEventWithStatus } from 'features/home/types';
import useIncrementalDelay from 'features/home/hooks/useIncrementalDelay';
import ZUIDate from 'zui/ZUIDate';
import SubOrgEventBlurb from '../components/SubOrgEventBlurb';
import { ZetkinEvent } from 'utils/types/zetkin';
import useUser from 'core/hooks/useUser';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useMyEvents from 'features/events/hooks/useMyEvents';
import NoEventsBlurb from '../components/NoEventsBlurb';
import ZUIText from 'zui/components/ZUIText';
import ZUIModal from 'zui/components/ZUIModal';
import ZUIDivider from 'zui/components/ZUIDivider';
import notEmpty from 'utils/notEmpty';
import {
  flipLatLng,
  pointsToBounds,
} from 'features/canvass/components/GLCanvassMap';
import ZUIMapControls from 'zui/ZUIMapControls';
import oldTheme from 'theme';
import { useEnv } from 'core/hooks';
import MarkerImageRenderer from 'features/canvass/components/GLCanvassMap/MarkerImageRenderer';

type Props = {
  orgId: number;
};

const PublicOrgPage: FC<Props> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const [postAuthEvent, setPostAuthEvent] = useState<ZetkinEvent | null>(null);
  const [includeSubOrgs, setIncludeSubOrgs] = useState(false);
  const nextDelay = useIncrementalDelay();
  const orgEvents = useUpcomingOrgEvents(orgId);
  const myEvents = useMyEvents();
  const user = useUser();

  const allEvents = useMemo(() => {
    return orgEvents.map<ZetkinEventWithStatus>((event) => ({
      ...event,
      status:
        myEvents.find((userEvent) => userEvent.id == event.id)?.status || null,
    }));
  }, [orgEvents]);

  const topOrgEvents = allEvents.filter(
    (event) => event.organization.id == orgId
  );

  const events =
    includeSubOrgs || topOrgEvents.length == 0 ? allEvents : topOrgEvents;

  const eventsByDate = events.reduce<Record<string, ZetkinEventWithStatus[]>>(
    (dates, event) => {
      const eventDate = event.start_time.slice(0, 10);
      const existingEvents = dates[eventDate] || [];

      const firstFilterDate = dayjs().format('YYYY-MM-DD');

      const dateToSortAs =
        firstFilterDate && eventDate < firstFilterDate
          ? firstFilterDate
          : eventDate;

      return {
        ...dates,
        [dateToSortAs]: [...existingEvents, event],
      };
    },
    {}
  );

  const dates = Object.keys(eventsByDate).sort();
  const indexForSubOrgsButton = Math.min(1, dates.length - 1);
  const showSubOrgBlurb = allEvents.length > events.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 1,
        height: '100%',
        my: 2,
      }}
    >
      {!dates.length && (
        <Box key="empty">
          <NoEventsBlurb orgId={orgId} />
        </Box>
      )}
      {dates.map((date, index) => (
        <Box key={date} paddingX={1}>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <Box sx={{ mb: 2, mt: 3 }}>
              <ZUIText variant="headingMd">
                <ZUIDate datetime={date} />
              </ZUIText>
            </Box>
          </Fade>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {eventsByDate[date].map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  onClickSignUp={(ev) => {
                    if (!user) {
                      setPostAuthEvent(event);
                      ev.preventDefault();
                    }
                  }}
                />
              ))}
            </Box>
          </Fade>
          {index == indexForSubOrgsButton && showSubOrgBlurb && (
            <Fade
              appear
              in
              mountOnEnter
              style={{ transitionDelay: nextDelay() }}
            >
              <Box sx={{ my: 4 }}>
                <ZUIDivider />
                <SubOrgEventBlurb
                  onClickShow={() => setIncludeSubOrgs(true)}
                  subOrgEvents={allEvents.filter(
                    (event) => event.organization.id != orgId
                  )}
                />
                <ZUIDivider />
              </Box>
            </Fade>
          )}
        </Box>
      ))}

      <ZUIModal
        onClose={() => setPostAuthEvent(null)}
        open={!!postAuthEvent}
        primaryButton={{
          href: `/login?redirect=${encodeURIComponent(`/o/${orgId}`)}`,
          label: messages.authDialog.loginButton(),
        }}
        secondaryButton={{
          label: messages.authDialog.cancelButton(),
          onClick: () => setPostAuthEvent(null),
        }}
        size="small"
        title={messages.authDialog.label()}
      >
        <Box sx={{ paddingTop: '0.75rem' }}>
          <ZUIText>
            <Msg id={messageIds.authDialog.content} />
          </ZUIText>
        </Box>
      </ZUIModal>
    </Box>
  );
};

export const OrgPageMap: FC<
  PropsWithChildren<{
    events: ZetkinEventWithStatus[];
    sx?: SxProps;
  }>
> = ({ children, events, sx }) => {
  const [map, setMap] = useState<MapType | null>(null);

  const env = useEnv();
  const bounds = useMemo(
    () =>
      pointsToBounds(
        events
          .map((event) => event.location)
          .filter(notEmpty)
          .map((location) => [location.lat, location.lng])
      ) ?? undefined,
    [events]
  );

  const locationsGeoJson: GeoJSON.FeatureCollection = useMemo(() => {
    return {
      features:
        events
          .map((event) => event.location)
          .filter(notEmpty)
          .map((location) => {
            const icon = 'marker';

            return {
              geometry: {
                coordinates: [location.lng, location.lat],
                type: 'Point',
              },
              properties: {
                icon,
              },
              type: 'Feature',
            };
          }) ?? [],
      type: 'FeatureCollection',
    };
  }, [events]);

  return (
    <Box
      sx={{ flexGrow: 1, height: '100px', position: 'relative', ...(sx ?? {}) }}
    >
      <ZUIMapControls
        onFitBounds={() => {
          if (map && bounds) {
            map.fitBounds(bounds, {
              animate: true,
              duration: 800,
              padding: 20,
            });
          }
        }}
        onGeolocate={(latLng) => {
          map?.panTo(flipLatLng(latLng), { animate: true, duration: 800 });
        }}
        onZoomIn={() => map?.zoomIn()}
        onZoomOut={() => map?.zoomOut()}
      />
      <Map
        ref={(map) => setMap(map?.getMap() ?? null)}
        initialViewState={{
          bounds,
          fitBoundsOptions: { padding: 20 },
        }}
        mapStyle={env.vars.MAPLIBRE_STYLE}
        onClick={(ev) => {
          ev.target.panTo(ev.lngLat, { animate: true });
        }}
        onLoad={(ev) => {
          const map = ev.target;

          map.addImage(
            'marker',
            new MarkerImageRenderer(0, 0, true, oldTheme.palette.primary.main)
          );
        }}
        style={{ height: '100%', width: '100%' }}
      >
        <Source data={locationsGeoJson} id="locations" type="geojson">
          <Layer
            id="locationMarkers"
            layout={{
              'icon-allow-overlap': true,
              'icon-image': ['get', 'icon'],
              'icon-offset': [0, -15],
              'symbol-sort-key': ['get', 'z'],
            }}
            source="locations"
            type="symbol"
          />
        </Source>
      </Map>
      {children}
    </Box>
  );
};

export default PublicOrgPage;
