'use client';

import { Box, Chip, Typography } from '@mui/material';
import { FC, Suspense } from 'react';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import useActiveCampaigns from '../hooks/useActiveCampaigns';
import useCallWithTarget from '../hooks/useCallWithTarget';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentPreparePage: FC<Props> = ({ assignment }) => {
  const call = useCallWithTarget(assignment.organization.id, assignment.id);
  const surveys = useSurveys(assignment.id).data || [];
  const campaigns = useActiveCampaigns(assignment.organization.id).data || [];

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
              <Msg id={messageIds.prepare.previousActivity} />
            </Typography>
            {call.target.past_actions.num_actions == 0 && (
              <Typography variant="body1">
                <Msg
                  id={messageIds.prepare.noPreviousActivity}
                  values={{ name: call.target.first_name }}
                />
              </Typography>
            )}
            {call.target.past_actions.num_actions > 0 && (
              <Typography variant="body1">
                <Msg
                  id={messageIds.prepare.arePreviousActivity}
                  values={{
                    actionTitle:
                      call.target.past_actions.last_action.activity.title || '',
                    activities: call.target.past_actions.num_actions,
                    name: call.target.first_name,
                  }}
                />
              </Typography>
            )}
            <Box mt={2}>
              <Typography variant="h5">
                <Msg
                  id={messageIds.prepare.previousCalls}
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
                  <Msg id={messageIds.prepare.arePreviousCalls} />
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
          {campaigns.length == 0 && (
            <Typography>
              <Msg id={messageIds.prepare.noActiveCampaigns} />
            </Typography>
          )}
          {campaigns.length > 0 &&
            campaigns.map((campaign) => {
              return (
                <Typography key={campaign.id}>
                  {campaign.campaign.title}
                </Typography>
              );
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
