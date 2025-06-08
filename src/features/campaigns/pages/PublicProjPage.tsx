'use client';

import dayjs from 'dayjs';
import { Box, Fade } from '@mui/material';
import { FC, useMemo, useState } from 'react';

import useCampaignAllEvents from '../hooks/useCampaignAllEvents';
import EventListItem from 'features/home/components/EventListItem';
import { ZetkinEventWithStatus } from 'features/home/types';
import useIncrementalDelay from 'features/home/hooks/useIncrementalDelay';
import ZUIDate from 'zui/ZUIDate';
import SubOrgEventBlurb from '../../organizations/components/SubOrgEventBlurb';
import { ZetkinEvent } from 'utils/types/zetkin';
import useUser from 'core/hooks/useUser';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useMyEvents from 'features/events/hooks/useMyEvents';
import NoEventsBlurb from '../../organizations/components/NoEventsBlurb';
import ZUIText from 'zui/components/ZUIText';
import ZUIModal from 'zui/components/ZUIModal';
import ZUIDivider from 'zui/components/ZUIDivider';

type PublicProjPageProps = {
  orgId: number;
  projId: number;
};

const PublicProjPage: FC<PublicProjPageProps> = ({ orgId, projId }) => {
  const messages = useMessages(messageIds);
  const [postAuthEvent, setPostAuthEvent] = useState<ZetkinEvent | null>(null);
  const [includeSubOrgs, setIncludeSubOrgs] = useState(false);
  const nextDelay = useIncrementalDelay();

  const projectEvents = useCampaignAllEvents(orgId, projId);
  const myEvents = useMyEvents();
  const user = useUser();

  const allProjectEvents = useMemo(() => {
    return projectEvents.map<ZetkinEventWithStatus>((event) => ({
      ...event,
      status:
        myEvents.find((userEvent) => userEvent.id == event.id)?.status || null,
    }));
  }, [projectEvents]);

  const topOrgEvents = allProjectEvents.filter(
    (event) => event.organization.id == orgId
  );

  const events =
    includeSubOrgs || topOrgEvents.length == 0
      ? allProjectEvents
      : topOrgEvents;

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
  const showSubOrgBlurb = allProjectEvents.length > events.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
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
                  subOrgEvents={allProjectEvents.filter(
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

export default PublicProjPage;
