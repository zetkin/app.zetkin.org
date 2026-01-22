import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { FC } from 'react';

import {
  ZetkinAreaAssignment,
  ZetkinLocation,
} from 'features/areaAssignments/types';
import PageBase from './PageBase';
import uselocationVisits from 'features/canvass/hooks/useLocationVisits';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import estimateVisitedHouseholds from 'features/canvass/utils/estimateVisitedHouseholds';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import useBasicLocationStats from 'features/canvass/hooks/useBasicLocationStats';
import { HOUSEHOLDS2 } from 'utils/featureFlags';
import useFeatureWithOrg from 'utils/featureFlags/useFeatureWithOrg';

type LocationPageProps = {
  assignment: ZetkinAreaAssignment;
  location: ZetkinLocation;
  onClose: () => void;
  onEdit: () => void;
  onHouseholds: (useNew: boolean) => void;
  onVisit: () => void;
};

const LocationPage: FC<LocationPageProps> = ({
  assignment,
  onClose,
  onEdit,
  onHouseholds,
  onVisit,
  location,
}) => {
  const hasHouseholds2 = useFeatureWithOrg(
    HOUSEHOLDS2,
    assignment.organization_id
  );
  const messages = useMessages(messageIds);
  const visits = uselocationVisits(
    assignment.organization_id,
    assignment.id,
    location.id
  );

  const { numHouseholds, numVisitedHouseholds } = useBasicLocationStats(
    assignment.id,
    location
  );

  return (
    <PageBase onClose={onClose} onEdit={onEdit} title={location.title}>
      <Box>
        <Typography
          color="secondary"
          onClick={onEdit}
          sx={{ fontStyle: location.description ? 'normal' : 'italic' }}
        >
          {location.description || messages.default.description()}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex" flexDirection="column" my={3}>
        {!!numHouseholds && !!numVisitedHouseholds && (
          <>
            <Typography variant="h4">
              <Msg
                id={messageIds.location.page.householdsVisitedStat}
                values={{ numHouseholds, numVisitedHouseholds }}
              />
            </Typography>
            <Typography variant="body2">
              <Msg id={messageIds.location.page.householdVisitedStatLabel} />
            </Typography>
          </>
        )}
        {!numHouseholds && (
          <Typography variant="body2">
            <Msg id={messageIds.location.page.noHouseholds} />
          </Typography>
        )}
      </Box>
      <Box display="flex" gap={1} justifyContent="center" m={4}>
        {assignment.reporting_level === 'location' && (
          <Button onClick={onVisit} variant="contained">
            <Msg id={messageIds.location.page.quickReportButtonLabel} />
          </Button>
        )}
        <Button onClick={() => onHouseholds(false)} variant="contained">
          <Msg id={messageIds.location.page.householdsButtonLabel} />
        </Button>
        {hasHouseholds2 && (
          <Button onClick={() => onHouseholds(true)} variant="contained">
            Households v2
          </Button>
        )}
      </Box>
      <Box my={2}>
        <Divider />
      </Box>
      <Box>
        <Typography>
          <Msg id={messageIds.location.page.historySectionHeader} />
        </Typography>
        <List>
          {visits.map((visit) => {
            const households = estimateVisitedHouseholds(visit);
            return (
              <ListItem key={visit.id}>
                <Box
                  display="flex"
                  gap={1}
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography>
                    <Msg
                      id={messageIds.location.page.numberOfHouseholds}
                      values={{ numHouseholds: households }}
                    />
                  </Typography>
                  <ZUIRelativeTime datetime={visit.created} />
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </PageBase>
  );
};

export default LocationPage;
