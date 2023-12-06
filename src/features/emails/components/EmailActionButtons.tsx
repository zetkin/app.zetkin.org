import { useState } from 'react';
import { ArrowDropDown, ContentCopy } from '@mui/icons-material';
import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  Tab,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import SendLaterPanel from './SendLaterPanel';
import { useMessages } from 'core/i18n';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const EmailActionButtons = () => {
  const messages = useMessages(messageIds);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<'now' | 'later'>('later');

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
            onClickAway={() => {
              setAnchorEl(null);
            }}
          >
            <Paper sx={{ p: 2, width: '500px' }}>
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
                  <SendLaterPanel />
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
