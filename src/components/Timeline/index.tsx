import { FormattedMessage } from 'react-intl';
import React from 'react';
import {
  Button,
  Collapse,
  Divider,
  Fade,
  Grid,
  MenuItem,
  Select,
} from '@material-ui/core';

import TimelineAddNote from './TimelineAddNote';
import TimelineUpdate from './TimelineUpdate';
import { ZetkinNoteBody } from 'types/zetkin';
import { ZetkinUpdate } from 'types/updates';
import useFilterUpdates, { UpdateFilterOptions } from './useFilterUpdates';

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
  const { filteredUpdates, updateTypeFilter, setUpdateTypeFilter } =
    useFilterUpdates(updates);

  return (
    <Fade appear in timeout={1000}>
      <Grid container direction="column" spacing={5}>
        <Grid item xs={6}>
          <Select
            fullWidth
            label="Type"
            onChange={(event) =>
              setUpdateTypeFilter(event.target.value as UpdateFilterOptions)
            }
            value={updateTypeFilter}
            variant="outlined"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="notes">Notes</MenuItem>
            <MenuItem value="files">Files</MenuItem>
            <MenuItem value="milestones">Milestones</MenuItem>
            <MenuItem value="tags">Tags</MenuItem>
          </Select>
        </Grid>
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
        {(expandable
          ? filteredUpdates.slice(0, SHOW_INITIALLY)
          : filteredUpdates
        ).map((update, idx) =>
          renderUpdate(
            update,
            idx <
              (!expandable || expanded
                ? filteredUpdates.length
                : SHOW_INITIALLY) -
                1
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
          {filteredUpdates
            .slice(SHOW_INITIALLY)
            .map((update, idx) =>
              renderUpdate(
                update,
                idx < filteredUpdates.length - SHOW_INITIALLY - 1
              )
            )}
        </Grid>
      </Collapse>
    );
  }
};

export default Timeline;
