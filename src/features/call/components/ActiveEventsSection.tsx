import { FC } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionSummary, Box, Typography } from '@mui/material';

import useActiveEvents from '../hooks/useActiveEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinCallTarget } from '../types';
import TargetEvent from './TargetEvent';

export type EventsByProject = {
  campaign: { id: number; title: string };
  events: ZetkinEvent[];
};

type ActiveEventsSectionProps = {
  orgId: number;
  target: ZetkinCallTarget;
};

const ActiveEventsSection: FC<ActiveEventsSectionProps> = ({
  orgId,
  target,
}) => {
  const events = useActiveEvents(orgId, target.id) || [];

  const groupEventsByProject = (events: ZetkinEvent[]): EventsByProject[] => {
    const map = new Map<
      number,
      { id: number; title: string } & { events: ZetkinEvent[] }
    >();

    for (const event of events) {
      const campaign = event.campaign;

      if (campaign) {
        if (!map.has(campaign.id)) {
          map.set(campaign.id, { ...campaign, events: [event] });
        } else {
          map.get(campaign.id)!.events.push(event);
        }
      }
    }

    return Array.from(map.values()).map(({ id, title, events }) => ({
      campaign: { id, title },
      events,
    }));
  };

  const projectsWithEvents = groupEventsByProject(events);
  const futureEvents = target.future_actions;

  return (
    <Box flex={1} mt={2}>
      <Typography my={1} variant="h6">
        <Msg id={messageIds.prepare.summary} />
      </Typography>
      <Typography variant="h5">
        <Msg id={messageIds.prepare.activeEvents} />
      </Typography>
      {projectsWithEvents.length === 0 && (
        <Typography>
          <Msg id={messageIds.prepare.noActiveEvents} />
        </Typography>
      )}
      {projectsWithEvents.length > 0 &&
        projectsWithEvents.map((project) => (
          <Accordion key={project.campaign.id}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box>
                <Typography variant="h6">{project.campaign.title}</Typography>

                <Typography>{project.events.length} Events</Typography>
                {!futureEvents.some(
                  (event: ZetkinEvent) =>
                    event.campaign?.id === project.campaign.id
                ) && (
                  <Typography>
                    <Msg
                      id={messageIds.activeEvents.noBookings}
                      values={{ name: target.first_name }}
                    />
                  </Typography>
                )}
                {futureEvents.some(
                  (event: ZetkinEvent) =>
                    event.campaign?.id === project.campaign.id
                ) && (
                  <Typography>
                    {target.first_name} has {futureEvents.length} bookings
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            {project.events.length > 0 &&
              project.events.map((event) => {
                return (
                  <TargetEvent key={event.id} event={event} target={target} />
                );
              })}
          </Accordion>
        ))}
    </Box>
  );
};

export default ActiveEventsSection;
