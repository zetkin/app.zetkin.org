import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';

import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import { ZetkinLocation, ZetkinMetric } from 'features/areaAssignments/types';
import useHousehold from 'features/canvass/hooks/useHousehold';
import { MetricResponse } from 'features/canvass/types';
import { VisitDetails } from 'features/canvass/components/LocationDialog/VisitDetails';
import { HouseholdVisit } from 'features/canvass/hooks/useVisitReporting';

type HouseholdPageProps = {
  householdId: number;
  lastVisit: HouseholdVisit | null;
  location: ZetkinLocation;
  metrics: ZetkinMetric[];
  onBack: () => void;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onHouseholdVisitStart: () => void;
};

const HouseholdPage: FC<HouseholdPageProps> = ({
  householdId,
  lastVisit,
  location,
  metrics,
  onBack,
  onClose,
  onDelete,
  onEdit,
  onHouseholdVisitStart,
}) => {
  const messages = useMessages(messageIds);
  const household = useHousehold(
    location.organization_id,
    location.id,
    householdId
  );

  return (
    <PageBase
      actions={
        <Box display="flex" flexDirection="column">
          <Button onClick={onHouseholdVisitStart} variant="contained">
            <Msg id={messageIds.households.single.logVisitButtonLabel} />
          </Button>
        </Box>
      }
      color={household.color === 'clear' ? null : household.color}
      onBack={onBack}
      onClose={onClose}
      onDelete={onDelete}
      onEdit={onEdit}
      subtitle={
        household.level
          ? messages.households.single.subtitle({
              floorNumber: household.level,
            })
          : messages.default.floor()
      }
      title={household.title}
    >
      {!lastVisit && (
        <Typography>
          <Msg id={messageIds.households.single.wasNotVisited} />
        </Typography>
      )}
      {lastVisit && <VisitDetails metrics={metrics} visit={lastVisit} />}
    </PageBase>
  );
};

export default HouseholdPage;
