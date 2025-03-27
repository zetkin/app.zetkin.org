import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';

import { ZetkinCall, ZetkinCallPatchBody } from '../types';
import useCallMutations from '../hooks/useCallMutations';

type ReportCallProps = {
  call: ZetkinCall;
  orgId: number;
};

const ReportCall: React.FC<ReportCallProps> = ({ call, orgId }) => {
  const { updateCall } = useCallMutations(orgId);
  const [message, setMessage] = useState(call.message_to_organizer || '');
  const [notes, setNotes] = useState(call.notes || '');
  const [organizerAction, setOrganizerAction] = useState(
    call.organizer_action_needed || false
  );
  const [state, setState] = useState(call.state || 0);

  const handleSubmit = () => {
    const updatedData: ZetkinCallPatchBody = {
      message_to_organizer: message,
      notes,
      organizer_action_needed: organizerAction,
      state,
    };

    updateCall(call.id, updatedData);
  };

  return (
    <Box mt={2}>
      <Typography variant="h5">Send Report</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
        }}
      >
        <TextField
          fullWidth
          label="Message to Organizer"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />

        <TextField
          fullWidth
          label="Notes"
          multiline
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          value={notes}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={organizerAction}
              onChange={(e) => setOrganizerAction(e.target.checked)}
            />
          }
          label="Organizer Action Needed"
        />

        <TextField
          fullWidth
          label="State"
          onChange={(e) => setState(Number(e.target.value))}
          type="number"
          value={state}
        />

        <Button onClick={handleSubmit} variant="contained">
          Send Report
        </Button>
      </Box>
    </Box>
  );
};

export default ReportCall;
