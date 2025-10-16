import { Box, lighten, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import useBasicLocationStats from 'features/canvass/hooks/useBasicLocationStats';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
};

const ContractedHeaderStats: FC<Props> = ({ assignment, location }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const { numHouseholds, numSuccessfulHouseholds, numVisitedHouseholds } =
    useBasicLocationStats(assignment.id, location);

  return (
    <Box alignItems="center" display="flex" justifyContent="space-between">
      {!!numVisitedHouseholds && (
        <>
          <Box
            sx={{
              backgroundColor: lighten(theme.palette.primary.main, 0.7),
              borderRadius: '50%',
              height: 10,
              mr: 0.5,
              width: 10,
            }}
          />
          <Typography color="secondary" variant="body2">
            <Msg
              id={messageIds.location.header}
              values={{ numHouseholds, numVisitedHouseholds }}
            />
          </Typography>
        </>
      )}

      {!!numSuccessfulHouseholds && (
        <>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: '50%',
              height: 10,
              ml: 1,
              mr: 0.5,
              width: 10,
            }}
          />
          <Typography color="secondary" variant="body2">
            {messages.location.subheader({
              successfulVisits: numSuccessfulHouseholds,
            })}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ContractedHeaderStats;
