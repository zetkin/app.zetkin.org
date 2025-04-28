'use client';

import { FC } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
import useCurrentCall from '../hooks/useCurrentCall';
import InstructionsSection from '../components/InstructionsSection';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUITagChip from 'zui/components/ZUITagChip';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import TargetInfo from '../components/TargetInfo';

export type EventsByProject = {
  campaign: { id: number; title: string };
  events: ZetkinEvent[];
};

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentPreparePage: FC<Props> = ({ assignment }) => {
  const call = useCurrentCall();
  const surveys = useSurveysWithElements(assignment.organization.id).data || [];
  surveys;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!call) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? 'column' : 'row'}
      width="100%"
    >
      <Box flex={isMobile ? 'none' : '6'} order={isMobile ? 1 : 2} p={2}>
        <ZUISection
          renderContent={() => (
            <>
              <TargetInfo call={call} />
              {call.target.tags.length > 0 && (
                <>
                  <ZUIText variant="headingMd">Tags</ZUIText>
                  <Box alignItems="center" display="flex" gap={1}>
                    {call.target.tags.map((tag) => {
                      return <ZUITagChip key={tag.id} tag={tag} />;
                    })}
                  </Box>
                </>
              )}
              {call.target.past_actions.num_actions > 0 && (
                <>
                  <ZUIText variant="headingMd">Previous activity</ZUIText>
                  <ZUIText display="inline">
                    {`${call.target.first_name} participated in `}
                    <ZUIText display="inline" variant="bodyMdSemiBold">
                      {call.target.past_actions.num_actions} actions
                    </ZUIText>
                    {`, the most recent being `}
                    <ZUIText display="inline" variant="bodyMdSemiBold">
                      {call.target.past_actions.last_action.title}
                    </ZUIText>{' '}
                    <ZUIRelativeTime
                      datetime={call.target.past_actions.last_action.end_time}
                    />
                    .
                  </ZUIText>
                </>
              )}
            </>
          )}
          title={`About ${call.target.first_name} ${call.target.last_name}`}
        />
      </Box>

      <Box flex={isMobile ? 'none' : '4'} order={isMobile ? 2 : 1} p={2}>
        <InstructionsSection instructions={assignment.instructions} />
      </Box>
    </Box>
  );
};

export default AssignmentPreparePage;
