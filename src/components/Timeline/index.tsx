import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Button, Collapse, Divider, Fade, Grid } from '@material-ui/core';

import TimelineAddNote from './TimelineAddNote';
import TimelineUpdate from './TimelineUpdate';
import { ZetkinUpdate } from 'types/updates';

export interface TimelineProps {
  expandable?: boolean;
  showAll?: boolean;
  updates: ZetkinUpdate[];
}

export const SHOW_INITIALLY = 5;

const Timeline: React.FunctionComponent<TimelineProps> = ({
  expandable,
  showAll,
  updates,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(!!showAll);

  return (
    <Fade appear in timeout={1000}>
      <Grid container direction="column" spacing={6}>
        <Grid item>
          <TimelineAddNote />
        </Grid>
        {renderUpdateList()}
        {expandable && renderExpandButton()}
      </Grid>
    </Fade>
  );

  function renderUpdateList() {
    return (
      <>
        {(expandable ? updates.slice(0, SHOW_INITIALLY) : updates).map(
          (update, idx) =>
            renderUpdate(
              update,
              idx <
                (!expandable || expanded ? updates.length : SHOW_INITIALLY) - 1
            )
        )}
        {expandable && renderExpandedUpdates()}
      </>
    );
  }

  function renderUpdate(update: ZetkinUpdate, divider: boolean) {
    return (
      <React.Fragment key={update.timestamp + update.type}>
        <Grid aria-label="timeline update" item>
          <TimelineUpdate update={update} />
        </Grid>
        {divider && <Divider style={{ width: '100%' }} />}
      </React.Fragment>
    );
  }

  function renderExpandButton() {
    return (
      <Grid item>
        <Button onClick={() => setExpanded(!expanded)} variant="outlined">
          <FormattedMessage id="misc.timeline.expand" />
        </Button>
      </Grid>
    );
  }

  function renderExpandedUpdates() {
    return (
      // Because MUI Collapse typing is wrong
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Collapse component={Grid} in={expanded} item>
        <Grid container direction="column" spacing={6}>
          {updates
            .slice(SHOW_INITIALLY)
            .map((update, idx) =>
              renderUpdate(update, idx < updates.length - SHOW_INITIALLY - 1)
            )}
        </Grid>
      </Collapse>
    );
  }
};

export default Timeline;
