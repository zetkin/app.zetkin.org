'use client';

import { Box, Chip, Typography } from '@mui/material';
import { FC, Suspense } from 'react';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import useActiveEvents from '../hooks/useActiveEvents';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import { useAppSelector } from 'core/hooks';

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentPreparePage: FC<Props> = ({ assignment }) => {
  const call = useAppSelector((state) => state.call.currentCall).data;
  const surveys = useSurveys(assignment.organization.id).data || [];
  const events = useActiveEvents(assignment.organization.id) || [];

  if (!call) {
    return null;
  }

  return (
    <Box display="flex" gap={2}>
      <Suspense fallback={<ZUILogoLoadingIndicator />}>
        <Box flex={1} m={2}>
          <Typography>
            <Msg id={messageIds.prepare.title} />
          </Typography>
          <ZUIAvatar
            size={'lg'}
            url={`/api/orgs/${assignment.organization.id}/people/${call.target.id}/avatar`}
          />
          <Typography mt={1} variant="h5">
            {call.target.first_name + ' ' + call.target.last_name}
          </Typography>
          <Typography mt={1}>{call.target.email}</Typography>
          <Box mt={2}>
            <Typography mt={1} variant="h5">
              <Msg id={messageIds.prepare.edit} />
            </Typography>

            <Typography variant="body1">
              <Msg id={messageIds.prepare.editDescription} />
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography mt={1} variant="h5">
              <Msg id={messageIds.prepare.tags} />
            </Typography>
            {call.target.tags.length > 0 ? (
              call.target.tags.map((tag) => {
                return <Chip key={tag.id} label={tag.title} />;
              })
            ) : (
              <Typography>
                <Msg id={messageIds.prepare.noTags} />
              </Typography>
            )}
          </Box>
          <Box mt={2}>
            <Typography mt={1} variant="h5">
              <Msg id={messageIds.prepare.previousEvents} />
            </Typography>
            {call.target.past_actions.num_actions == 0 && (
              <Typography variant="body1">
                <Msg
                  id={messageIds.prepare.noPreviousEvents}
                  values={{ name: call.target.first_name }}
                />
              </Typography>
            )}
            {call.target.past_actions.num_actions > 0 && (
              <Typography variant="body1">
                <Msg
                  id={messageIds.prepare.previousEventsOfTarget}
                  values={{
                    eventTitle:
                      call.target.past_actions.last_action.activity?.title ||
                      '',
                    name: call.target.first_name,
                    numEvents: call.target.past_actions.num_actions,
                  }}
                />
              </Typography>
            )}
            <Box mt={2}>
              <Typography variant="h5">
                <Msg
                  id={messageIds.prepare.previousCallsOfTarget}
                  values={{
                    name: call.target.first_name,
                  }}
                />
              </Typography>
              {call.target.call_log.length == 0 && (
                <Typography>
                  <Msg id={messageIds.prepare.noPreviousCalls} />
                </Typography>
              )}
              {call.target.call_log.length > 0 && (
                <Typography>
                  <Msg id={messageIds.prepare.previousCalls} />
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box flex={1} mt={2}>
          <Typography my={1}>
            <Msg id={messageIds.prepare.summary} />
          </Typography>
          <Typography variant="h5">
            <Msg id={messageIds.prepare.activeCampaigns} />
          </Typography>
          {events.length == 0 && (
            <Typography>
              <Msg id={messageIds.prepare.noActiveCampaigns} />
            </Typography>
          )}
          {events.length > 0 &&
            events.map((event) => {
              return <Typography key={event.id}>{event.title}</Typography>;
            })}
          <Box mt={2}>
            <Typography variant="h5">
              <Msg id={messageIds.prepare.surveys} />
            </Typography>
            {surveys.length == 0 && (
              <Typography>
                <Msg id={messageIds.prepare.noSurveys} />
              </Typography>
            )}
            {surveys.length > 0 &&
              surveys.map((survey) => {
                return <Typography key={survey.id}>{survey.title}</Typography>;
              })}
          </Box>
        </Box>
      </Suspense>
    </Box>
  );
};

export default AssignmentPreparePage;
