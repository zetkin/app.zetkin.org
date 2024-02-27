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
  ClickAwayListener,
  Paper,
  Stack,
  Tab,
} from '@mui/material';

import deliveryProblems from '../utils/deliveryProblems';
import messageIds from '../l10n/messageIds';
import useEmail from '../hooks/useEmail';
import { ZetkinEmail } from 'utils/types/zetkin';
import {
  getOffset,
  makeNaiveDateString,
  makeNaiveTimeString,
  removeOffset,
} from 'utils/dateUtils';
import { Msg, useMessages } from 'core/i18n';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ZUITimezonePicker, { findCurrentTZ } from 'zui/ZUITimezonePicker';

interface EmailDeliveryProps {
  email: ZetkinEmail;
  onClose: () => void;
  orgId: number;
}

dayjs.extend(utc);

const EmailDelivery = ({ email, onClose, orgId }: EmailDeliveryProps) => {
  const messages = useMessages(messageIds);
  const { updateEmail } = useEmail(orgId, email.id);

  const [sendingDate, setSendingDate] = useState(
    email?.published ? email.published.slice(0, 10) : null
  );
  const [sendingTime, setSendingTime] = useState(
    email?.published ? removeOffset(email.published.slice(11, 16)) : '09:00'
  );
  const naiveSending = `${sendingDate}T${sendingTime}`;

  //change time string to 'email.published' when API is fixed
  const scheduledTime = getOffset('2023-12-25T12:25:00+09:00');
  const currentTzValue = findCurrentTZ().utc;
  const [tzValue, setTzValue] = useState(scheduledTime || currentTzValue);

  const [tab, setTab] = useState<'now' | 'later'>('later');

  const problems = deliveryProblems(email);

  return (
    <ClickAwayListener
      mouseEvent="onMouseUp"
      onClickAway={() => {
        onClose();
        setTzValue(scheduledTime || currentTzValue);
      }}
    >
      <Paper sx={{ p: 2, width: '550px' }}>
        {problems.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {problems.map((problem, index) => (
              <Alert key={index} severity="error">
                <Msg id={messageIds.deliveryProblems[problem]} />
              </Alert>
            ))}
          </Box>
        ) : (
          <>
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
                      value={sendingDate ? dayjs(sendingDate) : null}
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
                      onChange={(value) => setTzValue(value)}
                      scheduledTime={scheduledTime}
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
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'end',
                mt: 2,
              }}
            >
              <Button
                disabled={tab === 'later' && sendingDate == null}
                onClick={() => {
                  updateEmail({
                    published:
                      tab === 'now'
                        ? `${
                            new Date().toISOString().split('.')[0]
                          }${currentTzValue}`
                        : `${naiveSending}:00${tzValue}`,
                  });
                  onClose();
                  setTzValue(scheduledTime || currentTzValue);
                }}
                variant="contained"
              >
                {tab === 'later'
                  ? messages.emailActionButtons.schedule()
                  : messages.emailActionButtons.sendAnyway()}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </ClickAwayListener>
  );
};

export default EmailDelivery;
