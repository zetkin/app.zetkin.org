import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Button, Divider, Grid } from '@material-ui/core';

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

  return (
    <Grid container direction="column" spacing={3}>
      {(expanded ? updates : updates.slice(0, SHOW_INITIALLY)).map(
        (update, idx) => (
          <React.Fragment key={update.created_at + update.type}>
            <Grid aria-label="timeline update" item>
              <TimelineUpdate update={update} />
            </Grid>
            {idx < (expanded ? updates.length : SHOW_INITIALLY) - 1 && (
              <Divider style={{ width: '100%' }} />
            )}
          </React.Fragment>
        )
      )}
      <Grid item>
        <Button onClick={() => setExpanded(!expanded)} variant="outlined">
          <FormattedMessage id="misc.timeline.expand" />
        </Button>
      </Grid>
    </Grid>
  );
};

export default Timeline;
