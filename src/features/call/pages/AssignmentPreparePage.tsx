'use client';

import { Box, Card, Chip, Typography } from '@mui/material';
import { FC, Suspense } from 'react';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import useActiveEvents from '../hooks/useActiveEvents';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import CallLog from '../components/CallLog';
import SurveyAccordion from '../components/SurveyAccordion';
import TargetEvents from '../components/TargetEvents';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
import ReportCall from '../components/ReportCall';
import useCurrentCall from '../hooks/useCurrentCall';

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentPreparePage: FC<Props> = ({ assignment }) => {
  const call = useCurrentCall();
  const surveys = useSurveysWithElements(assignment.organization.id).data || [];
  const events = useActiveEvents(assignment.organization.id).data || [];

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
          ID -- {call.target.id}
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
          <Card>
            <ReportCall
              assignmentId={assignment.id}
              call={call}
              orgId={assignment.organization.id}
            />
          </Card>
        </Box>
        <Box flex={1} mt={2}>
          <Typography my={1} variant="h6">
            <Msg id={messageIds.prepare.summary} />
          </Typography>
          <Typography variant="h5">
            <Msg id={messageIds.prepare.activeEvents} />
          </Typography>
          {events.length == 0 && (
            <Typography>
              <Msg id={messageIds.prepare.noActiveEvents} />
            </Typography>
          )}
          {events.length > 0 &&
            events.map((event) => {
              return (
                <TargetEvents
                  key={event.id}
                  event={event}
                  target={call.target}
                />
              );
            })}
          <Box mt={2}>
            <Typography variant="h6">Surveys</Typography>
            {surveys.length === 0 && (
              <Typography>No surveys available</Typography>
            )}
            {surveys.length > 0 &&
              surveys.map((survey) => (
                <SurveyAccordion
                  key={survey.id}
                  orgId={assignment.organization.id}
                  survey={survey}
                  target={call.target}
                />
              ))}
          </Box>
        </Box>
      </Suspense>
      <Box
        sx={{
          bottom: 16,
          left: 16,
          position: 'fixed',
          zIndex: 1300,
        }}
      >
        <CallLog
          assingmentId={assignment.id}
          orgId={assignment.organization.id}
        />
      </Box>
    </Box>
  );
};

export default AssignmentPreparePage;
