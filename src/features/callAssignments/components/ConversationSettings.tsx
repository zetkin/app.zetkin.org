import { Box, Paper, Stack, Switch, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import useCallAssignment from '../hooks/useCallAssignment';
import ZUISelect from 'zui/components/ZUISelect';
import { DialingMode } from '../betaTypes';

interface ConversationSettingsProps {
  assignmentId: number;
  orgId: number;
}

const ConversationSettings = ({
  assignmentId,
  orgId,
}: ConversationSettingsProps) => {
  const {
    data: callAssignment,
    updateCallAssignment,
    updateDialingMode,
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
            checked={!callAssignment?.disable_caller_notes}
            onChange={(evt) =>
              updateCallAssignment({
                disable_caller_notes: !evt.target.checked,
              })
            }
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
            checked={callAssignment?.expose_target_details}
            onChange={(evt) =>
              updateCallAssignment({
                expose_target_details: evt.target.checked,
              })
            }
          />
        </Box>
        <Typography>
          <Msg id={messageIds.conversation.settings.targetData.message} />
        </Typography>
        <Stack marginTop={2} spacing={2}>
          <div>
            <Box>
              <Typography variant="h6">
                <Msg id={messageIds.conversation.settings.dialing_mode.title} />
              </Typography>
            </Box>
            <Typography>
              <Msg id={messageIds.conversation.settings.dialing_mode.message} />
            </Typography>
          </div>
          <ZUISelect
            items={[
              {
                label: 'Manual',
                value: DialingMode.MANUAL,
              },
              {
                label: 'Automatic',
                value: DialingMode.AUTOMATIC,
              },
            ]}
            label="Dialling modes"
            onChange={(mode) => updateDialingMode(mode as DialingMode)}
            selectedOption={callAssignment?.dialing_mode || ''}
            size="large"
          />
        </Stack>
      </Box>
    </Paper>
  );
};

export default ConversationSettings;
