import { FC } from 'react';
import { Box, IconButton, lighten, useTheme } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

import PageBaseHeader from './pages/PageBaseHeader';
import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import useBasicLocationStats from 'features/canvass/hooks/useBasicLocationStats';

type Props = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
};

const ContractedHeader: FC<Props> = ({ assignment, location }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const { numHouseholds, numSuccessfulHouseholds, numVisitedHouseholds } =
    useBasicLocationStats(assignment.id, location);

  return (
    <PageBaseHeader
      iconButtons={
        <IconButton>
          <KeyboardArrowUp />
        </IconButton>
      }
      subtitle={
        <Box alignItems="center" display="flex" justifyContent="space-between">
          {numVisitedHouseholds && (
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
              <Msg
                id={messageIds.location.header}
                values={{ numHouseholds, numVisitedHouseholds }}
              />
            </>
          )}

          {numSuccessfulHouseholds && (
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
              {messages.location.subheader({
                successfulVisits: numSuccessfulHouseholds,
              })}
            </>
          )}
        </Box>
      }
      title={location.title}
    />
  );
};

export default ContractedHeader;
