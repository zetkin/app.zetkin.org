import { Box, Button, TextField } from '@mui/material';
import { FC, useState } from 'react';

import {
  Household as ZetkinHousehold,
  HouseholdPatchBody,
} from 'features/canvassAssignments/types';
import PageBase from './PageBase';

type HouseholdProps = {
  household: ZetkinHousehold;
  onBack: () => void;
  onClose: () => void;
  onHouseholdUpdate: (data: HouseholdPatchBody) => void;
  onWizardStart: () => void;
  visitedInThisAssignment: boolean;
};

const Household: FC<HouseholdProps> = ({
  household,
  onBack,
  onClose,
  onHouseholdUpdate,
  onWizardStart,
  visitedInThisAssignment,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(household.title || '');

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
      onEdit={() => setEditing(true)}
      title={household.title || 'Untitled household'}
    >
      <Box>
        {editing && (
          <Box alignItems="center" display="flex">
            <TextField
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="Household title"
              value={title}
            />
            <Button
              onClick={() => {
                setEditing(false);
                onHouseholdUpdate({
                  title: title,
                });
              }}
            >
              Save
            </Button>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
          </Box>
        )}
      </Box>
    </PageBase>
  );
};

export default Household;
