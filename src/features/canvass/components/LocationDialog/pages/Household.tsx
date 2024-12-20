import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';

import { Household as ZetkinHousehold } from 'features/areaAssignments/types';
import PageBase from './PageBase';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type HouseholdProps = {
  household: ZetkinHousehold;
  onBack: () => void;
  onClose: () => void;
  onEdit: () => void;
  onWizardStart: () => void;
  visitedInThisAssignment: boolean;
};

const Household: FC<HouseholdProps> = ({
  household,
  onBack,
  onClose,
  onEdit,
  onWizardStart,
  visitedInThisAssignment,
}) => {
  const messages = useMessages(messageIds);
  return (
    <PageBase
      actions={
        <Box display="flex" flexDirection="column">
          {visitedInThisAssignment && (
            <Typography>
              <Msg id={messageIds.households.single.wasVisited} />
            </Typography>
          )}
          <Button onClick={onWizardStart} variant="contained">
            <Msg id={messageIds.households.single.logVisitButtonLabel} />
          </Button>
        </Box>
      }
      onBack={onBack}
      onClose={onClose}
      onEdit={onEdit}
      subtitle={messages.households.single.subtitle({
        floorTitle: household.floor?.toString() || messages.default.floor(),
      })}
      title={household.title || messages.default.household()}
    />
  );
};

export default Household;
