import { FC } from 'react';
import { Close } from '@mui/icons-material';
import { Box, Divider, Paper, Typography } from '@mui/material';

import { ZetkinArea } from '../types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPerson from 'zui/ZUIPerson';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';

type Props = {
  area: ZetkinArea;
  assignees: ZetkinPerson[];
  onAddAssignee: (person: ZetkinPerson) => void;
  onClose: () => void;
};

const AreaPlanningOverlay: FC<Props> = ({
  area,
  assignees,
  onAddAssignee,
  onClose,
}) => {
  const messages = useMessages(messageIds);

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
          <Typography variant="h5">
            {area.title || messages.empty.title()}
          </Typography>
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
              : messages.empty.description()}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box m={1}>
        <Box>
          <Typography variant="h6">
            <Msg id={messageIds.planOverlay.assignees} />
          </Typography>
          {!assignees.length && (
            <Typography
              color="secondary"
              fontStyle={area.description?.trim().length ? 'inherit' : 'italic'}
              sx={{ overflowWrap: 'anywhere' }}
            >
              <Msg id={messageIds.planOverlay.noAssignees} />
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
          <Typography variant="h6">
            <Msg id={messageIds.planOverlay.addAssignee} />
          </Typography>
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

export default AreaPlanningOverlay;
