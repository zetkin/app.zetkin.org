import { Alert } from '@material-ui/lab';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import {
  Box,
  Button,
  CardActionArea,
  Collapse,
  Divider,
  Fade,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import TimelineAddNote from './TimelineAddNote';
import TimelineUpdate from './TimelineUpdate';
import { ZetkinNoteBody } from 'utils/types/zetkin';
import { ZetkinUpdate } from 'zui/Timeline/updates/types';
import useFilterUpdates, {
  UPDATE_TYPE_FILTER_OPTIONS,
} from './useFilterUpdates';

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
  const {
    groupedUpdates,
    filteredUpdates,
    updateTypeFilter,
    setUpdateTypeFilter,
    typeFilterOptions,
  } = useFilterUpdates(updates);

  return (
    <Fade appear in timeout={1000}>
      <Grid container direction="column" spacing={5}>
        <Grid item>
          <TimelineAddNote disabled={disabled} onSubmit={onAddNote} />
        </Grid>
        <Grid item sm={6} xl={4} xs={12}>
          {/* Filter timeline select */}
          <Select
            fullWidth
            onChange={(event) =>
              setUpdateTypeFilter(
                event.target.value as UPDATE_TYPE_FILTER_OPTIONS
              )
            }
            renderValue={(value) => (
              <Typography color="secondary">
                <FormattedMessage
                  id="misc.timeline.filter.filterSelectLabel"
                  values={{
                    filter: (
                      <FormattedMessage
                        id={`misc.timeline.filter.byType.${value}`}
                      />
                    ),
                  }}
                />
              </Typography>
            )}
            value={updateTypeFilter}
            variant="outlined"
          >
            {typeFilterOptions.map((type) => {
              return (
                <MenuItem
                  key={type}
                  disabled={groupedUpdates[type].length === 0}
                  value={type}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Box>
                      <FormattedMessage
                        id={`misc.timeline.filter.byType.${type}`}
                      />
                    </Box>
                    <Box>{groupedUpdates[type].length}</Box>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        {updateTypeFilter !== 'all' && (
          <Grid item>
            <CardActionArea>
              <Alert
                onClick={() =>
                  setUpdateTypeFilter(UPDATE_TYPE_FILTER_OPTIONS.ALL)
                }
                severity="warning"
                style={{ cursor: 'pointer' }}
              >
                <FormattedMessage id="misc.timeline.filter.warning" />
              </Alert>
            </CardActionArea>
          </Grid>
        )}
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
