import { Box, Button, Typography } from '@mui/material';
import { FC, useState } from 'react';

import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import { ZetkinLocation } from 'features/areaAssignments/types';
import useHousehold from 'features/canvass/hooks/useHousehold';
import ZUIConfirmDialog from 'zui/ZUIConfirmDialog';

type HouseholdPageProps = {
  householdId: number;
  location: ZetkinLocation;
  onBack: () => void;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onHouseholdVisitStart: () => void;
  visitedInThisAssignment: boolean;
};

const HouseholdPage: FC<HouseholdPageProps> = ({
  householdId,
  location,
  onBack,
  onClose,
  onDelete,
  onEdit,
  onHouseholdVisitStart,
  visitedInThisAssignment,
}) => {
  const messages = useMessages(messageIds);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const household = useHousehold(
    location.organization_id,
    location.id,
    householdId
  );

  return (
    <>
      <PageBase
        actions={
          <Box display="flex" flexDirection="column">
            {visitedInThisAssignment && (
              <Typography>
                <Msg id={messageIds.households.single.wasVisited} />
              </Typography>
            )}
            <Button onClick={onHouseholdVisitStart} variant="contained">
              <Msg id={messageIds.households.single.logVisitButtonLabel} />
            </Button>
          </Box>
        }
        onBack={onBack}
        onClose={onClose}
        onDelete={() => setDeleteDialogOpen(true)}
        onEdit={onEdit}
        subtitle={
          household.level
            ? messages.households.single.subtitle({
                floorNumber: household.level,
              })
            : messages.default.floor()
        }
        title={household.title}
      />
      <ZUIConfirmDialog
        indexValue={99999}
        onCancel={() => setDeleteDialogOpen(false)}
        onSubmit={onDelete}
        open={deleteDialogOpen}
        title={messages.households.delete.title()}
        warningText={messages.households.delete.warningText({
          household: household.title,
        })}
      />
    </>
  );
};

export default HouseholdPage;
