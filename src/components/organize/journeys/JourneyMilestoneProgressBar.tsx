import { FormattedMessage as Msg } from 'react-intl';
import { Box, LinearProgress, Typography } from '@material-ui/core';

import { ZetkinJourneyMilestone } from 'types/zetkin';

const JourneyMilestoneProgressBar = ({
  milestones,
}: {
  milestones: ZetkinJourneyMilestone[];
}): JSX.Element => {
  const completed = milestones.filter(
    (milestone) => milestone.status === 'completed'
  );

  const percentCompleted = Math.floor(
    (completed.length / milestones.length) * 100
  );

  return (
    <>
      <Box mr={1} width="100%">
        <LinearProgress value={percentCompleted} variant="determinate" />
      </Box>
      <Typography style={{ fontWeight: 'bold' }}>
        {`${percentCompleted}% `}
        <Msg id="pages.organizeJourneyInstance.complete" />
      </Typography>
    </>
  );
};

export default JourneyMilestoneProgressBar;
