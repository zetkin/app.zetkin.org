import { Alert } from '@mui/material';
import React, { useState } from 'react';
import {
  Box,
  CardActionArea,
  Divider,
  Fade,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { Msg } from 'core/i18n';
import TimelineAddNote from './TimelineAddNote';
import TimelineUpdate from './TimelineUpdate';
import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import useFilterUpdates, {
  UPDATE_TYPE_FILTER_OPTIONS,
} from './useFilterUpdates';
import { ZetkinNote, ZetkinNoteBody } from 'utils/types/zetkin';
import messageIds from './l10n/messageIds';

export interface ZUITimelineProps {
  disabled?: boolean;
  onAddNote: (note: ZetkinNoteBody) => void;
  onEditNote: (note: Pick<ZetkinNote, 'id' | 'text'>) => void;
  updates: ZetkinUpdate[];
}

const ZUITimeline: React.FunctionComponent<ZUITimelineProps> = ({
  disabled,
  onAddNote,
  onEditNote,
  updates,
}) => {
  const {
    groupedUpdates,
    filteredUpdates,
    updateTypeFilter,
    setUpdateTypeFilter,
    typeFilterOptions,
  } = useFilterUpdates(updates);

  const [showPostRequestError, setShowPostRequestError] = useState(false);

  return (
    <Fade appear in timeout={1000}>
      <Grid container direction="column" spacing={5}>
        <Grid item>
          <TimelineAddNote
            disabled={disabled}
            onSubmit={async (note) => {
              setShowPostRequestError(false);
              try {
                // Await is needed here to catch the exception if the request fails
                await onAddNote(note);
              } catch (e) {
                setShowPostRequestError(true);
              }
            }}
            showPostRequestError={showPostRequestError}
          />
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
                <Msg
                  id={messageIds.filter.filterSelectLabel}
                  values={{
                    filter: <Msg id={messageIds.filter.byType[value]} />,
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
                      <Msg id={messageIds.filter.byType[type]} />
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
                <Msg id={messageIds.filter.warning} />
              </Alert>
            </CardActionArea>
          </Grid>
        )}
        {renderUpdateList()}
      </Grid>
    </Fade>
  );

  function renderUpdateList() {
    return (
      <>
        {filteredUpdates.map((update, idx) =>
          renderUpdate(update, idx < filteredUpdates.length)
        )}
      </>
    );
  }

  function renderUpdate(update: ZetkinUpdate, divider: boolean) {
    return (
      <React.Fragment key={update.timestamp + update.type}>
        <Grid aria-label="timeline update" item>
          <TimelineUpdate onEditNote={onEditNote} update={update} />
        </Grid>
        {divider && (
          <Grid item>
            <Divider style={{ width: '100%' }} />
          </Grid>
        )}
      </React.Fragment>
    );
  }
};

export default ZUITimeline;
