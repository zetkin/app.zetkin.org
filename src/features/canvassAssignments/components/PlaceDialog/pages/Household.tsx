import { Box, Button } from '@mui/material';
import { FC } from 'react';

import { Household as ZetkinHousehold } from 'features/canvassAssignments/types';
import PageBase from './PageBase';

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
  return (
    <PageBase
      actions={
        <Box display="flex" flexDirection="column">
          {visitedInThisAssignment &&
            'This household has been visted in this assignment.'}
          <Button onClick={onWizardStart} variant="contained">
            Log visit
          </Button>
        </Box>
      }
      onBack={onBack}
      onClose={onClose}
      onEdit={onEdit}
      title={household.title || 'Untitled household'}
    />
  );
};

export default Household;
