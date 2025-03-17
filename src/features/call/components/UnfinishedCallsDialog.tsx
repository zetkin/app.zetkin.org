import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { Close, List } from '@mui/icons-material';

import ZUIAvatar from 'zui/ZUIAvatar';
import useCallMutations from '../hooks/useCallMutations';
import useOutgoingCalls from '../hooks/useOutgoingCalls';

type UnfinishedCallsDialogProps = {
  assingmentId: number;
  orgId: number;
};

const UnfinishedCallsDialog: React.FC<UnfinishedCallsDialogProps> = ({
  assingmentId,
  orgId,
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { deleteCall } = useCallMutations(orgId);
  const router = useRouter();
  const outgoingCalls = useOutgoingCalls();
  const unfinishedCallList = outgoingCalls.filter((call) => call.state === 0);

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

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle variant="h6">Unfinished calls</DialogTitle>
        <IconButton
          onClick={() => setOpen(false)}
          sx={(theme) => ({
            color: theme.palette.grey[500],
            position: 'absolute',
            right: 8,
            top: 8,
          })}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <Typography sx={{ mb: 2 }} variant="subtitle1">
            Here are calls you started but never finished. You should finish the
            calls or abandon them so others can call the same people.
          </Typography>

          {unfinishedCallList.map((call) => {
            return (
              <Box key={call.id} sx={{ mb: 2 }}>
                <Box alignItems="center" display="flex" mb={1}>
                  <ZUIAvatar
                    size={'sm'}
                    url={`/api/orgs/${orgId}/people/${call.target.id}/avatar`}
                  />
                  <Typography ml={1}>
                    {call.target.first_name + ' ' + call.target.last_name}
                  </Typography>
                </Box>
                <Button
                  color="error"
                  onClick={() => {
                    setOpen(false);
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
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnfinishedCallsDialog;
