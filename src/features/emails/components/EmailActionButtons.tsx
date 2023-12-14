import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { TimeField } from '@mui/x-date-pickers-pro';
import { useState } from 'react';
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
import { ArrowDropDown, ContentCopy } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import useEmail from '../hooks/useEmail';
import useEmailStats from '../hooks/useEmailStats';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUITimezonePicker from 'zui/ZUITimezonePicker';
import {
  makeNaiveDateString,
  makeNaiveTimeString,
  removeOffset,
} from 'utils/dateUtils';
import { Msg, useMessages } from 'core/i18n';
import { TabContext, TabList, TabPanel } from '@mui/lab';

dayjs.extend(utc);

interface EmailActionButtonsProp {
  orgId: number;
  emailId: number;
}

const EmailActionButtons = ({ orgId, emailId }: EmailActionButtonsProp) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<'now' | 'later'>('later');
  // const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [utcValue, setUtcValue] = useState('');
  const [unlocked, setUnlocked] = useState(true);

  const { data: email } = useEmail(orgId, emailId);
  const { statsFuture } = useEmailStats(orgId, emailId);

  const [sendingDate, setSendingDate] = useState(
    email?.published ? email.published.slice(0, 10) : null
  );
  const [sendingTime, setSendingTime] = useState(
    email?.published ? removeOffset(email.published.slice(11, 16)) : '09:00'
  );
  const targetNum = statsFuture.data?.allTargets || 0;

  const naiveSending = `${sendingDate || '0000-00-00'}T${sendingTime}`;

  return (
    <Box display="flex">
      <Button
        disabled={targetNum === 0}
        endIcon={<ArrowDropDown />}
        onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)}
        variant="contained"
      >
        {messages.emailActionButtons.delevery()}
      </Button>
      <Popper anchorEl={anchorEl} open={!!anchorEl} placement="bottom-end">
        <ClickAwayListener
          mouseEvent="onMouseUp"
          onClickAway={() => {
            setAnchorEl(null);
            // setUtcTime(currentTimezone);
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
                      value={dayjs(naiveSending)}
                    />
                    <ZUITimezonePicker
                      onChange={(value) => {
                        setUtcValue(value.utc);
                      }}
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
                  <Msg id={messageIds.emailActionButtons.sendNow.alert.desc} />
                </Alert>
              </TabPanel>
            </TabContext>
            <Box display="flex" flexDirection="column">
              <FormControlLabel
                control={
                  <Checkbox onChange={(e) => setUnlocked(!e.target.checked)} />
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
                disabled={sendingDate == '' || unlocked}
                onClick={() => {
                  setAnchorEl(null);
                  // setUtcTime(currentTimezone);
                  console.log({ date: `${naiveSending}:00Z${utcValue}` });
                  // save: () => {
                  // updateEmail({
                  //   date:`${naiveSending}:00`
                  // });
                  // },
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
        ]}
      />
    </Box>
  );
};

export default EmailActionButtons;
