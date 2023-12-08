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

const EmailActionButtons = () => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<'now' | 'later'>('later');
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [tzCode, setTzCode] = useState(currentTimezone);
  const [locked, setLocked] = useState(false);

  //const {data:emailFuture, isTargeted} = useEmail(orgId, emailId)
  //const {updateEmail} = useEmailMutations(orgId, data.id)
  // const {statsFuture} = useEmailStats(orgId,emailId)

  // -----------fake datas-----------------
  const isTargeted = true;
  const fakeEmailFuture = { data: { date: '2023-12-09T10:00:00+00:00' } };
  const statsFuture = { data: { allTargets: 11 } };
  // --------------------------------------
  const [sendingDate, setSendingDate] = useState(
    fakeEmailFuture.data.date.slice(0, 10)
  );
  const [sendingTime, setSendingTime] = useState(
    removeOffset(fakeEmailFuture.data.date.slice(11, 16))
  );

  const naiveSending = `${sendingDate}T${sendingTime}`;

  return (
    <Box display="flex">
      <Button
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
            setTzCode(currentTimezone);
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
                      value={dayjs(sendingDate)}
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
                        setTzCode(value.tzCode);
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
            {isTargeted && (
              <Box display="flex" flexDirection="column">
                <FormControlLabel
                  control={
                    <Checkbox onChange={(e) => setLocked(e.target.checked)} />
                  }
                  label={messages.emailActionButtons.lockTarget()}
                  sx={{ margin: '10px 10px 0 10px' }}
                />
                <Typography color="secondary" variant="body2">
                  <Msg id={messageIds.emailActionButtons.lockDesc} />
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'end',
                mt: 2,
              }}
            >
              <Typography
                sx={{ color: theme.palette.grey['500'], mr: 2 }}
                variant="body1"
              >
                {locked ? (
                  <Msg
                    id={messageIds.emailActionButtons.afterLock}
                    values={{ numTargets: statsFuture.data.allTargets || 0 }}
                  />
                ) : (
                  <Msg
                    id={messageIds.emailActionButtons.beforeLock}
                    values={{ numTargets: statsFuture.data.allTargets || 0 }}
                  />
                )}
              </Typography>
              <Button
                onClick={() => {
                  setAnchorEl(null);
                  setTzCode(currentTimezone);
                  // save: () => {
                  // updateEmail({
                  //   date:`${naiveSending}:00`
                  //   timezone:tzCode
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
