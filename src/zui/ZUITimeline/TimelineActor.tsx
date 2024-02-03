import { Grid } from '@mui/material';
import React from 'react';

import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

const TimelineActor: React.FunctionComponent<{
  actor: ZetkinUpdate['actor'];
  size: number;
}> = ({ actor, size }) => {
  return (
    <Grid item>
      <ZUIPersonHoverCard personId={actor.id}>
        <ZUIPerson id={actor.id} name={''} showText={false} size={size} />
      </ZUIPersonHoverCard>
    </Grid>
  );
};

export default TimelineActor;
