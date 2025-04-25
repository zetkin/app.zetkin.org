import { FC } from 'react';
import { Box, IconButton, lighten, useTheme } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

import PageBaseHeader from './pages/PageBaseHeader';
import { ZetkinLocation } from 'features/areaAssignments/types';
import { useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type Props = {
  location: ZetkinLocation;
};

const ContractedHeader: FC<Props> = ({ location }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  // TODO: get stats from location API
  /*
  const numHouseholdsVisitedIndividually =
    location?.households.filter((household) =>
      household.visits.some((visit) => visit.assignment_id == assignment.id)
    ).length ?? 0;

  const numHouseholdsPerLocationVisit =
    visitsFuture.data?.map(estimateVisitedHouseholds) ?? [];

  const numVisitedHouseholds = Math.max(
    numHouseholdsVisitedIndividually,
    ...numHouseholdsPerLocationVisit
  );

  const numHouseholds = Math.max(
    location.households.length,
    numVisitedHouseholds
  );

  const metricDefinesDone =
    assignment.metrics.find((metric) => metric.definesDone)?.id || null;

  const successfulVisits = location?.households.filter((household) =>
    household.visits.some(
      (visit) =>
        visit.assignment_id === assignment.id &&
        visit.responses.some(
          (response) =>
            response.metricId === metricDefinesDone &&
            response.response.toLowerCase() === 'yes'
        )
    )
  ).length;
  */

  const numVisitedHouseholds = 0;
  const numHouseholds =
    location.num_estimated_households || location.num_known_households;
  const successfulVisits = 0;

  return (
    <PageBaseHeader
      iconButtons={
        <IconButton>
          <KeyboardArrowUp />
        </IconButton>
      }
      subtitle={
        <Box alignItems="center" display="flex" justifyContent="space-between">
          {numVisitedHouseholds > 0 && (
            <Box
              sx={{
                backgroundColor: lighten(theme.palette.primary.main, 0.7),
                borderRadius: '50%',
                height: 10,
                mr: 0.5,
                width: 10,
              }}
            />
          )}
          {messages.location.header({
            numHouseholds,
            numVisitedHouseholds,
          })}

          {successfulVisits > 0 && (
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
                successfulVisits,
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
