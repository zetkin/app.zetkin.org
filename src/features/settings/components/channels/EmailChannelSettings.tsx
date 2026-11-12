import { FC, Fragment, useContext, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import isEmail from 'validator/lib/isEmail';

import { Msg, useMessages } from 'core/i18n';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';
import messageIds from 'features/settings/l10n/messageIds';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUIFuture from 'zui/ZUIFuture';
import { ZetkinEmailConfig } from 'utils/types/zetkin';
import { IFuture } from 'core/caching/futures';
import useCreateEmailChannel from 'features/settings/hooks/useCreateEmailChannel';

const EmailChannelSettings: FC<{ orgId: number }> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const channelsFuture: IFuture<ZetkinEmailConfig[]> = useEmailConfigs(orgId);
  const createChannel = useCreateEmailChannel(orgId);

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [noReply, setNoReply] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState(false);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const [loading, setLoading] = useState(false);
  const [errorCreating, setErrorCreating] = useState(false);

  const [createChannelDialogOpen, setCreateChannelDialogOpen] = useState(false);

  const closeDialog = () => {
    setCreateChannelDialogOpen(false);
    setSenderEmail('');
    setEmailValidationError(false);
    setSenderName('');
    setErrorCreating(false);
    setNoReply(false);
  };

  // Reset error state when retrying to type email
  useEffect(() => {
    if (emailValidationError) {
      setEmailValidationError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderEmail]);

  const formIsIncomplete =
    !senderName.trim().length || !senderEmail.trim().length;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4">
            <Msg id={messageIds.email.channels.overview.title} />
          </Typography>
          <Button
            onClick={() => setCreateChannelDialogOpen(true)}
            variant="outlined"
          >
            <Msg id={messageIds.email.channels.addChannel} />
          </Button>
        </Box>
        <Typography>
          <Msg id={messageIds.email.channels.overview.description} />
        </Typography>
        <ZUIFuture
          future={channelsFuture}
          skeleton={<Skeleton height={200} variant="rounded" />}
        >
          {(channels) => (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.palette.common.white,
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: 1,
                })}
              >
                <Box sx={{ display: 'flex', padding: 2 }}>
                  <Typography sx={{ flex: 1 }} variant="h5">
                    <Msg
                      id={messageIds.email.channels.list.headers.senderName}
                    />
                  </Typography>
                  <Typography sx={{ flex: 1 }} variant="h5">
                    <Msg
                      id={messageIds.email.channels.list.headers.senderEmail}
                    />
                  </Typography>
                  <Typography sx={{ flex: 1 }} variant="h5">
                    <Msg id={messageIds.email.channels.list.headers.noReply} />
                  </Typography>
                </Box>
                <Divider />
                {channels.map((channel) => (
                  <Fragment key={channel.id}>
                    <Box sx={{ display: 'flex', padding: 2 }}>
                      <Typography sx={{ flex: 1 }}>
                        {channel.sender_name}
                      </Typography>
                      <Typography color="secondary" sx={{ flex: 1 }}>
                        {channel.sender_email}
                      </Typography>
                      <Typography color="secondary" sx={{ flex: 1 }}>
                        {channel.no_reply ? (
                          <Msg
                            id={
                              messageIds.email.channels.list.noReply
                                .canNotRespond
                            }
                          />
                        ) : (
                          <Msg
                            id={
                              messageIds.email.channels.list.noReply.canRespond
                            }
                          />
                        )}
                      </Typography>
                    </Box>
                    <Divider />
                  </Fragment>
                ))}
              </Box>
            </Box>
          )}
        </ZUIFuture>
      </Box>
      <Dialog
        fullWidth
        onClose={() => closeDialog()}
        open={createChannelDialogOpen}
      >
        <DialogContent>
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();

              setErrorCreating(false);

              if (!isEmail(senderEmail)) {
                setEmailValidationError(true);
                return;
              }

              try {
                setLoading(true);
                await createChannel({
                  config: {},
                  domain: senderEmail.split('@')[1],
                  no_reply: noReply,
                  sender_email: senderEmail,
                  sender_name: senderName,
                });
                closeDialog();
                showSnackbar(
                  'success',
                  messages.email.channels.createDialog.createSuccessMessage({
                    title: senderName,
                  })
                );
              } catch {
                setErrorCreating(true);
              } finally {
                setLoading(false);
              }
            }}
          >
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h5">
                <Msg id={messageIds.email.channels.createDialog.title} />
              </Typography>
              <TextField
                fullWidth
                label={messages.email.channels.createDialog.senderInputLabel()}
                onChange={(event) => {
                  setSenderName(event.target.value);
                }}
                value={senderName}
              />
              <TextField
                error={emailValidationError}
                fullWidth
                helperText={
                  emailValidationError
                    ? messages.email.channels.createDialog.emailErrorMessage()
                    : undefined
                }
                label={messages.email.channels.createDialog.emailInputLabel()}
                onChange={(event) => {
                  setSenderEmail(event.target.value);
                }}
                value={senderEmail}
              />
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={noReply}
                      onChange={(ev, newState) => setNoReply(newState)}
                    />
                  }
                  label={messages.email.channels.createDialog.noReplyCheckboxLabel()}
                />
                <Typography color="secondary" variant="body2">
                  <Msg
                    id={
                      messageIds.email.channels.createDialog
                        .noReplyCheckboxDescription
                    }
                  />
                </Typography>
              </Box>
              <Divider />
              {errorCreating && (
                <Alert severity="error">
                  <Msg
                    id={
                      messageIds.email.channels.createDialog.createErrorMessage
                    }
                  />
                </Alert>
              )}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={() => closeDialog()}>
                  <Msg
                    id={messageIds.email.channels.createDialog.cancelButton}
                  />
                </Button>
                <Button
                  disabled={formIsIncomplete}
                  loading={loading}
                  type="submit"
                  variant="contained"
                >
                  <Msg
                    id={messageIds.email.channels.createDialog.createButton}
                  />
                </Button>
              </Box>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailChannelSettings;
