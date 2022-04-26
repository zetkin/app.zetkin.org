import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Button, Collapse, Divider, Fade, Grid } from '@material-ui/core';

import TimelineUpdate from './TimelineUpdate';
import { ZetkinUpdate } from 'types/updates';

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

  return (
    <Fade appear in timeout={1000}>
      <Grid container direction="column" spacing={3}>
        {renderUpdateList()}
        <Grid item>
          <Button onClick={() => setExpanded(!expanded)} variant="outlined">
            <FormattedMessage id="misc.timeline.expand" />
          </Button>
        </Grid>
      </Grid>
    </Fade>
  );

  function renderUpdateList() {
    return (
      <>
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
          style={{ padding: expanded ? 12 : '0 12px' }}
        >
          <Grid container direction="column" spacing={3}>
            {updates
              .slice(SHOW_INITIALLY)
              .map((update, idx) =>
                renderUpdate(update, idx < updates.length - SHOW_INITIALLY - 1)
              )}
          </Grid>
        </Collapse>
      </>
    );
  }

  function renderUpdate(update: ZetkinUpdate, divider: boolean) {
    return (
      <React.Fragment key={update.created_at + update.type}>
        <Grid aria-label="timeline update" item>
          <TimelineUpdate update={update} />
        </Grid>
        {divider && <Divider style={{ width: '100%' }} />}
      </React.Fragment>
    );
  }
};

export default Timeline;
