import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { TimeField } from '@mui/x-date-pickers-pro';
import utc from 'dayjs/plugin/utc';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  Paper,
  Popper,
  Stack,
  Tab,
  Typography,
  useTheme,
} from '@mui/material';
import { ArrowDropDown, ContentCopy, Delete, Send } from '@mui/icons-material';
import { useContext, useState } from 'react';

import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import useEmail from '../hooks/useEmail';
import useEmailStats from '../hooks/useEmailStats';
import { ZetkinEmail } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import {
  makeNaiveDateString,
  makeNaiveTimeString,
  removeOffset,
} from 'utils/dateUtils';
import { Msg, useMessages } from 'core/i18n';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ZUITimezonePicker, { findTimezone } from 'zui/ZUITimezonePicker';
import ZUIDateSpan from 'zui/ZUIDateSpan';

dayjs.extend(utc);

interface EmailActionButtonsProp {
  email: ZetkinEmail;
  emailState: EmailState;
  orgId: number;
}

const EmailActionButtons = ({
  email,
  emailState,
  orgId,
}: EmailActionButtonsProp) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<'now' | 'later'>('later');
  const [utcValue, setUtcValue] = useState(findTimezone().utc);

  // fake data
  const [unlocked, setUnlocked] = useState(true);

  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { deleteEmail, updateEmail } = useEmail(orgId, email.id);
  const { statsFuture } = useEmailStats(orgId, email.id);
  const targetNum = statsFuture.data?.allTargets || 0;

  const [sendingDate, setSendingDate] = useState(
    email?.published ? email.published.slice(0, 10) : null
  );
  const [sendingTime, setSendingTime] = useState(
    email?.published ? removeOffset(email.published.slice(11, 16)) : '09:00'
  );

  const naiveSending = `${sendingDate}T${sendingTime}`;

  return (
    <Box alignItems="flex-end" display="flex" flexDirection="column" gap={1}>
      <Box display="flex">
        <Button
          disabled={targetNum === 0 || emailState === EmailState.SENT}
          endIcon={<ArrowDropDown />}
          onClick={(event) =>
            setAnchorEl(anchorEl ? null : event.currentTarget)
          }
          variant="contained"
        >
          {messages.emailActionButtons.delevery()}
        </Button>
        <Popper anchorEl={anchorEl} open={!!anchorEl} placement="bottom-end">
          <ClickAwayListener
            mouseEvent="onMouseUp"
            onClickAway={() => {
              setAnchorEl(null);
              setUtcValue(findTimezone().utc);
            }}
          >
            <Paper sx={{ p: 2, width: '550px' }}>
              <TabContext value={tab}>
                <TabList onChange={(ev, value) => setTab(value)} value={tab}>
                  <Tab
                    label={messages.emailActionButtons.sendLater()}
                    value="later"
                  />
                  <Tab
                    label={messages.emailActionButtons.sendNow.header()}
                    value="now"
                  />
                </TabList>
                <TabPanel sx={{ p: 0 }} value="later">
                  <Box display="flex" flexDirection="column" mt={2}>
                    <Box display="flex" flex={1} pr={1} width={'50%'}>
                      <DatePicker
                        format="DD-MM-YYYY"
                        label={messages.emailActionButtons.deliveryDate()}
                        onChange={(newSendingDate) => {
                          if (newSendingDate) {
                            const sendingDateStr = makeNaiveDateString(
                              newSendingDate.utc().toDate()
                            );
                            setSendingDate(sendingDateStr);
                          }
                        }}
                        sx={{ marginBottom: 2 }}
                        value={sendingDate != '' ? dayjs(sendingDate) : null}
                      />
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <TimeField
                        ampm={false}
                        format="HH:mm"
                        fullWidth
                        label={messages.emailActionButtons.deliveryTime()}
                        onChange={(newSendingTime) => {
                          if (newSendingTime) {
                            const sendingTimeStr = makeNaiveTimeString(
                              newSendingTime.utc().toDate()
                            );
                            setSendingTime(sendingTimeStr);
                          }
                        }}
                        value={dayjs(`0000-00-00T${sendingTime}`)}
                      />
                      <ZUITimezonePicker
                        onChange={(value) => setUtcValue(value)}
                      />
                    </Stack>
                  </Box>
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value="now">
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <AlertTitle>
                      <Msg
                        id={messageIds.emailActionButtons.sendNow.alert.title}
                      />
                    </AlertTitle>
                    <Msg
                      id={messageIds.emailActionButtons.sendNow.alert.desc}
                    />
                  </Alert>
                </TabPanel>
              </TabContext>
              <Box display="flex" flexDirection="column">
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => setUnlocked(!e.target.checked)}
                    />
                  }
                  label={messages.emailActionButtons.lockTarget()}
                  sx={{ margin: '10px 10px 0 10px', width: 'fit-content' }}
                />
                <Typography color="secondary" variant="body2">
                  <Msg id={messageIds.emailActionButtons.lockDesc} />
                </Typography>
              </Box>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'end',
                  mt: 2,
                }}
              >
                {sendingDate == '' ? (
                  <Typography
                    sx={{ color: theme.palette.statusColors.orange, mr: 1 }}
                  >
                    <Msg id={messageIds.emailActionButtons.setDate} />
                  </Typography>
                ) : (
                  <>
                    {''}
                    {unlocked ? (
                      <Typography
                        sx={{ color: theme.palette.statusColors.orange, mr: 1 }}
                      >
                        <Msg id={messageIds.emailActionButtons.beforeLock} />
                      </Typography>
                    ) : (
                      <Typography
                        sx={{ color: theme.palette.grey['500'], mr: 2 }}
                        variant="body1"
                      >
                        <Msg
                          id={messageIds.emailActionButtons.afterLock}
                          values={{ numTargets: targetNum }}
                        />
                      </Typography>
                    )}
                  </>
                )}
                <Button
                  disabled={
                    (tab === 'later' && sendingDate == null) || unlocked
                  }
                  onClick={() => {
                    updateEmail({
                      published:
                        tab === 'now'
                          ? `${new Date().toISOString().split('.')[0]}+00:00`
                          : `${naiveSending}:00${utcValue}`,
                    });
                    setAnchorEl(null);
                    setUtcValue(findTimezone().utc);
                  }}
                  variant="contained"
                >
                  {messages.emailActionButtons.schedule()}
                </Button>
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>
        <ZUIEllipsisMenu
          items={[
            {
              label: <>{messages.emailActionButtons.duplicate()}</>,
              startIcon: <ContentCopy />,
            },
            {
              label: <>{messages.emailActionButtons.delete()}</>,
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: deleteEmail,
                  title: messages.emailActionButtons.delete(),
                  warningText: messages.emailActionButtons.warning(),
                });
              },
              startIcon: <Delete />,
            },
          ]}
        />
      </Box>
      {emailState === EmailState.SENT && (
        <Box alignItems="center" display="flex">
          <Send sx={{ mr: 1 }} />
          <Msg id={messageIds.wasSent} values={{ time: sendingTime }} />
          {', '}
          <ZUIDateSpan
            end={new Date(email.published)}
            start={new Date(email.published)}
          />
        </Box>
      )}
    </Box>
  );
};

export default EmailActionButtons;
