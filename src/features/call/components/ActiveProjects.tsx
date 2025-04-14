import { FC } from 'react';
import { Accordion, AccordionSummary, Box, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import { EventsByProject } from '../pages/AssignmentPreparePage';
import TargetEvent from './TargetEvent';
import { ZetkinEvent } from 'utils/types/zetkin';
import { CombinedEventResponse, ZetkinCallTarget } from '../types';

interface ActiveProjectsProps {
  eventsByProject: EventsByProject;
  target: ZetkinCallTarget;
}

const ActiveProjects: FC<ActiveProjectsProps> = ({
  eventsByProject,
  target,
}) => {
  const responses = target.action_responses;
  const futureEvents = target.future_actions;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box>
          <Typography variant="h6">{eventsByProject.campaign.title}</Typography>
          <Typography>{eventsByProject.events.length} Events</Typography>
          {!futureEvents.some(
            (event: ZetkinEvent) =>
              event.campaign?.id === eventsByProject.campaign.id
          ) && <Typography>{target.first_name} has no bookings </Typography>}
          {futureEvents.some(
            (event: ZetkinEvent) =>
              event.campaign?.id === eventsByProject.campaign.id
          ) && (
            <Typography>
              {target.first_name} has {futureEvents.length} bookings
            </Typography>
          )}
          {!responses.some(
            (response: CombinedEventResponse) =>
              response.action?.campaign?.id === eventsByProject.campaign.id
          ) && (
            <Typography>
              {target.first_name} has no unbooked sign-ups
            </Typography>
          )}
          {responses.length > 0 &&
            responses.some(
              (response: CombinedEventResponse) =>
                response.action?.campaign?.id === eventsByProject.campaign.id
            ) && (
              <Typography>
                {target.first_name} has {responses.length} unbooked sign-ups
              </Typography>
            )}
        </Box>
      </AccordionSummary>
      {eventsByProject.events.length > 0 &&
        eventsByProject.events.map((event) => {
          return <TargetEvent key={event.id} event={event} target={target} />;
        })}
    </Accordion>
  );
};

export default ActiveProjects;
