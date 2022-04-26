import React from 'react';
import { Box, Grid } from '@material-ui/core';

import { ZetkinUpdateJourneyMilestone } from 'types/updates';

interface Props {
  update: ZetkinUpdateJourneyMilestone;
}

const TimelineJourneyMilestone: React.FunctionComponent<Props> = ({
  update,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Grid alignItems="center" container direction="row" spacing={1}>
        {update.details.milestone.title}
        {update.type}
      </Grid>
    </Box>
  );
};

export default TimelineJourneyMilestone;
