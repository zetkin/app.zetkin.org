import { Box, Paper, Switch, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import useCallAssignment from '../hooks/useCallAssignment';

interface ConversationSettingsProps {
  assignmentId: number;
  orgId: number;
}

const ConversationSettings = ({
  assignmentId,
  orgId,
}: ConversationSettingsProps) => {
  const {
    disableCallerNotes,
    exposeTargetDetails,
    setCallerNotesEnabled,
    setTargetDetailsExposed,
  } = useCallAssignment(orgId, assignmentId);

  return (
    <Paper>
      <Box padding={2}>
        <Typography variant="h4">
          <Msg id={messageIds.conversation.settings.title} />
        </Typography>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          marginTop={2}
        >
          <Typography variant="h6">
            <Msg id={messageIds.conversation.settings.notes.title} />
          </Typography>
          <Switch
            //this looks backwards bc in interface we use the positive "allow"
            checked={!disableCallerNotes}
            onChange={(evt) => setCallerNotesEnabled(evt.target.checked)}
          />
        </Box>
        <Typography>
          <Msg id={messageIds.conversation.settings.notes.message} />
        </Typography>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          marginTop={1}
        >
          <Typography variant="h6">
            <Msg id={messageIds.conversation.settings.targetData.title} />
          </Typography>
          <Switch
            checked={exposeTargetDetails}
            onChange={(evt) => setTargetDetailsExposed(evt.target.checked)}
          />
        </Box>
        <Typography>
          <Msg id={messageIds.conversation.settings.targetData.message} />
        </Typography>
      </Box>
    </Paper>
  );
};

export default ConversationSettings;
