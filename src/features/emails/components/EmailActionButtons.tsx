import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { TimeField } from '@mui/x-date-pickers-pro';
import { useState } from 'react';
import utc from 'dayjs/plugin/utc';
import { ArrowDropDown, ContentCopy } from '@mui/icons-material';
import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  Stack,
  Tab,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { makeNaiveDateString, removeOffset } from 'utils/dateUtils';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ZUITimezonePicker, { TimezoneType } from 'zui/ZUITimezonePicker';

dayjs.extend(utc);

const EmailActionButtons = () => {
  const messages = useMessages(messageIds);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<'now' | 'later'>('later');
  //const emailFuture = useEmail(orgId, emailId)
  //const {updateEmail} = useEmailMutations(orgId, data.id)
  const fakeEmailFuture = { data: { date: '2023-12-09T10:00:00+00:00' } };
  const [sendingDate, setSendingDate] = useState(
    fakeEmailFuture.data.date.slice(0, 10)
  );
  const [sendingTime, setSendingTIme] = useState(
    removeOffset(fakeEmailFuture.data.date.slice(11, 16))
  );
  console.log(sendingDate, ' date');

  const hey = (value: TimezoneType) => {
    console.log(value, ' value');
  };

  return (
    <Box alignItems="flex-end" display="flex" flexDirection="column" gap={1}>
      <Box display="flex">
        <Button
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
                    label={messages.emailActionButtons.sendNow()}
                    value="now"
                  />
                </TabList>
                <TabPanel value="later">
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
                        value={dayjs(new Date())}
                      />
                      <ZUITimezonePicker onChange={hey} />
                    </Stack>
                  </Box>
                </TabPanel>
                <TabPanel value="now">send now</TabPanel>
              </TabContext>
              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Button sx={{ mt: 2 }} variant="contained">
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
    </Box>
  );
};

export default EmailActionButtons;
