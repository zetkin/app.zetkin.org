import TabContext from '@mui/lab/TabContext';
import React, { useState } from 'react';
import TabList from '@mui/lab/TabList';
import { CircularProgress, Stack, Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';

import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import EditTab from 'features/emails/components/ThemeEditor/EditTab';

interface ThemeEditorProps {
  orgId: number;
  themeId: number;
  selectedBlockIndex: number;
}

const ThemeEditor: React.FC<ThemeEditorProps> = (props) => {
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<'frame' | 'style' | 'block'>(
    'frame'
  );

  const { isLoading } = useEmailTheme(props.orgId, props.themeId);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="column" display="flex" gap={2}>
      <TabContext value={activeTab}>
        <TabList onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab
            label={messages.themes.editor.tabs.frame()}
            sx={{ marginLeft: 2 }}
            value={'content'}
          />
          <Tab
            label={messages.themes.editor.tabs.style()}
            sx={{ marginLeft: 2 }}
            value={'style'}
          />
          <Tab
            label={messages.themes.editor.tabs.block()}
            sx={{ marginLeft: 2 }}
            value={'block'}
          />
        </TabList>
        <TabPanel
          sx={{
            flexGrow: 0,
            overflowY: 'auto',
            padding: 0,
          }}
          value="content"
        >
          <EditTab
            editingSection="frame_mjml"
            orgId={props.orgId}
            themeId={props.themeId}
          />
        </TabPanel>
        <TabPanel
          sx={{
            flexGrow: 0,
            overflowY: 'auto',
            padding: 0,
          }}
          value="style"
        >
          <EditTab
            editingSection="css"
            orgId={props.orgId}
            themeId={props.themeId}
          />
        </TabPanel>
        <TabPanel
          sx={{
            flexGrow: 0,
            overflowY: 'auto',
            padding: 0,
          }}
          value="block"
        >
          <EditTab
            editingSection="block_attributes"
            orgId={props.orgId}
            themeId={props.themeId}
          />
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

export default ThemeEditor;
