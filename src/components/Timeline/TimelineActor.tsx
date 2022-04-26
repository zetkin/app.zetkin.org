import { Grid } from '@material-ui/core';
import React from 'react';

import PersonHoverCard from 'components/PersonHoverCard';
import ZetkinPerson from 'components/ZetkinPerson';
import { ZetkinUpdate } from 'types/updates';

const TimelineActor: React.FunctionComponent<{
  actor: ZetkinUpdate['actor'];
  size: number;
}> = ({ actor, size }) => {
  return (
    <>
      <Grid item>
        <PersonHoverCard personId={actor.id}>
          <ZetkinPerson id={actor.id} name={''} showText={false} size={size} />
        </PersonHoverCard>
      </Grid>
    </>
  );
};

export default TimelineActor;
