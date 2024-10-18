import { Box, Button, TextField } from '@mui/material';
import { FC } from 'react';

import { HouseholdPatchBody } from 'features/canvassAssignments/types';

type HouseholdProps = {
  editingHouseholdTitle: boolean;
  householdTitle: string;
  onEditHouseholdTitleEnd: () => void;
  onHouseholdTitleChange: (newTitle: string) => void;
  onHouseholdUpdate: (data: HouseholdPatchBody) => void;
  onWizardStart: () => void;
  visitedRecently: boolean;
};

const Household: FC<HouseholdProps> = ({
  householdTitle,
  onHouseholdTitleChange,
  editingHouseholdTitle,
  onEditHouseholdTitleEnd,
  onHouseholdUpdate,
  onWizardStart,
  visitedRecently,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      height="100%"
      paddingTop={1}
    >
      <Box>
        {editingHouseholdTitle && (
          <Box alignItems="center" display="flex">
            <TextField
              onChange={(ev) => onHouseholdTitleChange(ev.target.value)}
              placeholder="Household title"
              value={householdTitle}
            />
            <Button
              onClick={() => {
                onHouseholdUpdate({
                  title: householdTitle,
                });
                onEditHouseholdTitleEnd();
                onHouseholdTitleChange('');
              }}
            >
              Save
            </Button>
            <Button onClick={onEditHouseholdTitleEnd}>Cancel</Button>
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="flex-end"
        overflow="hidden"
      >
        {visitedRecently &&
          'This household has been visted within the past 24 hours.'}
        <Button
          disabled={visitedRecently}
          onClick={onWizardStart}
          variant="contained"
        >
          Log visit
        </Button>

        {/*                 <Box
      display="flex"
      flexDirection="column"
      sx={{ marginTop: 2, overflowY: 'auto' }}
    >
      <Typography
        marginBottom={2}
        sx={{ alignItems: 'baseline', display: 'flex' }}
        variant="h6"
      >
        <Msg id={messageIds.place.logList} />
        <Typography sx={{ marginLeft: 1 }}>
          {sortedVisits.length}
        </Typography>
      </Typography>
      <Divider />
      {sortedVisits.length == 0 && (
        <Msg id={messageIds.place.noActivity} />
      )}
      {sortedVisits.map((visit) => (
        <Box key={visit.id} paddingTop={1}>
          <Typography>{messages.place.visitLog()}</Typography>
          <Typography
            color="secondary"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <ZUIDateTime datetime={visit.timestamp} />
          </Typography>
        </Box>
      ))}
    </Box> */}
      </Box>
    </Box>
  );
};

export default Household;
