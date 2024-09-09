import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import { ZetkinPlace } from '../types';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIDateTime from 'zui/ZUIDateTime';

type PlaceDetailsProps = {
  onClose: () => void;
  onLogActivity: () => void;
  place: ZetkinPlace;
};

const PlaceDetails: FC<PlaceDetailsProps> = ({
  onClose,
  onLogActivity,
  place,
}) => {
  const sortedVisits = place.visits.toSorted((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    if (dateA > dateB) {
      return -1;
    } else if (dateB > dateA) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="space-between"
    >
      <Box>
        <Box display="flex" flexDirection="column" gap={1} paddingTop={1}>
          <Typography variant="h6">
            <Msg id={messageIds.place.description} />
          </Typography>
          <Typography>
            {place.description || (
              <Msg id={messageIds.place.empty.description} />
            )}
          </Typography>
          <Box>
            <Typography variant="h6">
              <Msg id={messageIds.place.activityHeader} />
            </Typography>
            <>
              {sortedVisits.length == 0 && (
                <Msg id={messageIds.place.noActivity} />
              )}
              {sortedVisits.map((visit) => (
                <Box key={visit.id} paddingTop={1}>
                  <Typography color="secondary">
                    <ZUIDateTime datetime={visit.timestamp} />
                  </Typography>
                  <Typography>{visit.note}</Typography>
                </Box>
              ))}
            </>
          </Box>
        </Box>
      </Box>
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button onClick={onClose} variant="outlined">
          <Msg id={messageIds.place.closeButton} />
        </Button>
        <Button onClick={onLogActivity} variant="contained">
          <Msg id={messageIds.place.logActivityButton} />
        </Button>
      </Box>
    </Box>
  );
};

export default PlaceDetails;
