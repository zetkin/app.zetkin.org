import { FC } from 'react';
import { Close } from '@mui/icons-material';
import { Box, Divider, Paper, Typography } from '@mui/material';

import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPerson from 'zui/ZUIPerson';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import { ZetkinArea } from 'features/areas/types';

type Props = {
  area: ZetkinArea;
  assignees: ZetkinPerson[];
  onAddAssignee: (person: ZetkinPerson) => void;
  onClose: () => void;
};

const PlanMapAreaOverlay: FC<Props> = ({
  area,
  assignees,
  onAddAssignee,
  onClose,
}) => {
  return (
    <Paper
      sx={{
        bottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 400,
        padding: 2,
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        zIndex: 1000,
      }}
    >
      <Box padding={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">{area.title || 'Untitled area'}</Typography>
          <Close
            color="secondary"
            onClick={() => {
              onClose();
            }}
            sx={{
              cursor: 'pointer',
            }}
          />
        </Box>
        <Box paddingTop={1}>
          <Typography
            color="secondary"
            fontStyle={area.description?.trim().length ? 'inherit' : 'italic'}
            sx={{ overflowWrap: 'anywhere' }}
          >
            {area.description?.trim().length
              ? area.description
              : 'Empty description'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box m={1}>
        <Box>
          <Typography variant="h6">Assignees </Typography>
          {!assignees.length && (
            <Typography
              color="secondary"
              fontStyle={area.description?.trim().length ? 'inherit' : 'italic'}
              sx={{ overflowWrap: 'anywhere' }}
            >
              No assignees
            </Typography>
          )}
          {assignees.map((assignee) => (
            <Box key={assignee.id} my={1}>
              <ZUIPerson
                id={assignee.id}
                name={`${assignee.first_name} ${assignee.last_name}`}
              />
            </Box>
          ))}
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Add assignee</Typography>
          <ZUIPersonSelect
            onChange={function (person: ZetkinPerson): void {
              onAddAssignee(person);
            }}
            selectedPerson={null}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default PlanMapAreaOverlay;
