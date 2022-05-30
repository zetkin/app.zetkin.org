import { FormattedMessage } from 'react-intl';
import { Button, Collapse, Divider, Fade, Grid } from '@material-ui/core';
import React, { useMemo } from 'react';

import TimelineAddNote from './TimelineAddNote';
import TimelineUpdate from './TimelineUpdate';
import { ZetkinNoteBody } from 'types/zetkin';
import { ZetkinUpdate } from 'types/updates';

export interface TimelineProps {
  disabled?: boolean;
  expandable?: boolean;
  onAddNote: (note: ZetkinNoteBody) => void;
  showAll?: boolean;
  updates: ZetkinUpdate[];
}

export const SHOW_INITIALLY = 5;

const Timeline: React.FunctionComponent<TimelineProps> = ({
  disabled,
  expandable,
  onAddNote,
  showAll,
  updates,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(!!showAll);

  const sorted = useMemo(
    () =>
      updates.sort(
        (u0, u1) =>
          new Date(u1.timestamp).getTime() - new Date(u0.timestamp).getTime()
      ),
    [updates]
  );

  return (
    <Fade appear in timeout={1000}>
      <Grid container direction="column" spacing={5}>
        <Grid item>
          <TimelineAddNote disabled={disabled} onSubmit={onAddNote} />
        </Grid>
        {renderUpdateList()}
        {expandable && renderExpandButton()}
      </Grid>
    </Fade>
  );

  function renderUpdateList() {
    return (
      <>
        {(expandable ? sorted.slice(0, SHOW_INITIALLY) : sorted).map(
          (update, idx) =>
            renderUpdate(
              update,
              idx <
                (!expandable || expanded ? sorted.length : SHOW_INITIALLY) - 1
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
        {divider && (
          <Grid item>
            <Divider style={{ width: '100%' }} />
          </Grid>
        )}
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
          {sorted
            .slice(SHOW_INITIALLY)
            .map((update, idx) =>
              renderUpdate(update, idx < sorted.length - SHOW_INITIALLY - 1)
            )}
        </Grid>
      </Collapse>
    );
  }
};

export default Timeline;
