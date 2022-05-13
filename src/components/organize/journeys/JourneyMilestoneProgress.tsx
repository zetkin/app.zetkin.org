import { Schedule } from '@material-ui/icons';
import { Box, LinearProgress, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import { ZetkinJourneyMilestoneStatus } from 'types/zetkin';

const JourneyMilestoneProgress = ({
  milestones,
  next_milestone,
}: {
  milestones: ZetkinJourneyMilestoneStatus[];
  next_milestone: ZetkinJourneyMilestoneStatus | null;
}): JSX.Element => {
  const completed = milestones.filter((milestone) => milestone.completed);

  const percentComplete = Math.floor(
    (completed.length / milestones.length) * 100
  );

  return (
    <>
      <Box mr={1} width="100%">
        <LinearProgress value={percentComplete} variant="determinate" />
      </Box>
      <Typography
        style={{
          fontWeight: 'bold',
          padding: '0.5rem 0 0.5rem 0',
          textTransform: 'lowercase',
        }}
      >
        <Msg
          id="pages.organizeJourneyInstance.percentComplete"
          values={{ percentComplete }}
        />
      </Typography>
      {next_milestone && (
        <Box
          display="flex"
          flexDirection="row"
          style={{ paddingBottom: '1rem' }}
        >
          <Schedule color="secondary" style={{ marginRight: '0.25rem' }} />
          <Typography color="secondary">
            {next_milestone.title}
            {': '}
            {next_milestone.deadline && (
              <FormattedDate
                day="numeric"
                month="long"
                value={next_milestone.deadline}
                year="numeric"
              />
            )}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default JourneyMilestoneProgress;
