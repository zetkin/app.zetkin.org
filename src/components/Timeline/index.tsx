import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Button, Collapse, Divider, Fade, Grid } from '@material-ui/core';

import TimelineUpdate from './TimelineUpdate';
import { ZetkinUpdate } from 'types/zetkin';

export interface TimelineProps {
  showAll?: boolean;
  updates: ZetkinUpdate[];
}

export const SHOW_INITIALLY = 5;

const Timeline: React.FunctionComponent<TimelineProps> = ({
  showAll,
  updates,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(!!showAll);

  const renderUpdate = (update: ZetkinUpdate, divider: boolean) => (
    <React.Fragment key={update.created_at + update.type}>
      <Grid aria-label="timeline update" item>
        <TimelineUpdate update={update} />
      </Grid>
      {divider && <Divider style={{ width: '100%' }} />}
    </React.Fragment>
  );

  return (
    <Fade appear in timeout={1000}>
      <Grid container direction="column" spacing={3}>
        {updates
          .slice(0, SHOW_INITIALLY)
          .map((update, idx) =>
            renderUpdate(
              update,
              idx < (expanded ? updates.length : SHOW_INITIALLY) - 1
            )
          )}
        <Collapse
          component={Grid}
          in={expanded}
          style={{ padding: expanded ? 12 : 0 }}
        >
          <Grid container direction="column" spacing={3}>
            {updates
              .slice(SHOW_INITIALLY)
              .map((update, idx) =>
                renderUpdate(update, idx < updates.length - SHOW_INITIALLY - 1)
              )}
          </Grid>
        </Collapse>
        <Grid item>
          <Button onClick={() => setExpanded(!expanded)} variant="outlined">
            <FormattedMessage id="misc.timeline.expand" />
          </Button>
        </Grid>
      </Grid>
    </Fade>
  );
};

export default Timeline;
