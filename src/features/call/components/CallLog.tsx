import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { Close, List } from '@mui/icons-material';

import ZUIAvatar from 'zui/ZUIAvatar';
import useCallMutations from '../hooks/useCallMutations';
import useOutgoingCalls from '../hooks/useOutgoingCalls';

type CallLogProps = {
  assingmentId: number;
  orgId: number;
};

const CallLog: React.FC<CallLogProps> = ({ assingmentId, orgId }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { deleteCall, switchCurrentCall } = useCallMutations(orgId);
  const router = useRouter();
  const outgoingCalls = useOutgoingCalls();
  const unfinishedCallList = outgoingCalls.filter((call) => call.state === 0);
  const previousCallsList = outgoingCalls.filter((call) => call.state !== 0);

  const UnfinishedCallsList = () => (
    <Box>
      <Typography sx={{ mb: 2 }} variant="subtitle1">
        Unfinished calls
      </Typography>
      <Typography sx={{ mb: 2 }} variant="subtitle1">
        Here are calls you started but never finished. You should finish the
        calls or abandon them so others can call the same people.
      </Typography>
      {unfinishedCallList.map((call) => (
        <Box key={call.id} sx={{ mb: 2, pb: 1 }}>
          <Box alignItems="center" display="flex" mb={1}>
            <ZUIAvatar
              size="sm"
              url={`/api/orgs/${orgId}/people/${call.target.id}/avatar`}
            />
            <Typography ml={1}>
              {call.target.first_name + ' ' + call.target.last_name}
            </Typography>
            <Typography ml={1}>{call.target.phone}</Typography>
          </Box>
          <Button
            color="error"
            onClick={() => {
              setOpen(false);
              switchCurrentCall(call);
            }}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Switch to this call
          </Button>
          <Button
            onClick={() => {
              deleteCall(call.id);
              if (unfinishedCallList.length <= 1) {
                router.push(`/call/${assingmentId}`);
              }
            }}
            variant="outlined"
          >
            Abandon call
          </Button>
        </Box>
      ))}
    </Box>
  );

  const PreviousCalls = () => (
    <Box>
      <Typography sx={{ mb: 2 }} variant="subtitle1">
        Your previous calls
      </Typography>
      <Typography>
        You can start new calls with people you have called before
      </Typography>
      {previousCallsList.map((call) => (
        <Box key={call.id} sx={{ mb: 2, pb: 1 }}>
          <Box alignItems="center" display="flex" mb={1}>
            <ZUIAvatar
              size="sm"
              url={`/api/orgs/${orgId}/people/${call.target.id}/avatar`}
            />
            <Typography ml={1}>
              {call.target.first_name + ' ' + call.target.last_name}
            </Typography>
            <Typography ml={1}>{call.target.phone}</Typography>
          </Box>
          <Button
            color="error"
            onClick={() => {
              setOpen(false);
              switchCurrentCall(call);
            }}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Log new call with {call.target.first_name}
          </Button>
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        size="small"
        sx={{
          backgroundColor: theme.palette.primary.main,
          borderRadius: '50%',
          color: theme.palette.background.default,
          height: 46,
          width: 46,
        }}
      >
        <List />
      </IconButton>

      <Dialog
        fullWidth
        maxWidth="md"
        onClose={() => setOpen(false)}
        open={open}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            color: theme.palette.grey[500],
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <PreviousCalls />
            </Box>
            <Box sx={{ flex: 1 }}>
              <UnfinishedCallsList />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CallLog;
