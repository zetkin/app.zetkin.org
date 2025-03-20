'use client';

import { FC } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import AssignmentStatsCard from './AssignmentStatsCard';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  assignment: ZetkinCallAssignment;
};

const AssignmentStats: FC<Props> = ({ assignment }) => {
  const messages = useMessages(messageIds);
  const stats = useSimpleCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <AssignmentStatsCard
        amount={stats.num_target_matches}
        label={messages.stats.targetMatches()}
      />
      <AssignmentStatsCard
        amount={stats.num_calls_made}
        label={messages.stats.callsMade()}
      />
      <AssignmentStatsCard
        amount={stats.num_calls_reached}
        label={messages.stats.callsReached()}
      />
    </Box>
  );
};

export default AssignmentStats;
