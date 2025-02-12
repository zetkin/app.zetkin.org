import { Box, Divider, Stack, Tab } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import messageIds from 'features/emails/l10n/messageIds';
import PreviewTab from './PreviewTab';
import { useMessages } from 'core/i18n';
import BlockListItem from './BlockListItem';
import { EmailContentBlock } from 'features/emails/types';

interface EmailSettingsProps {
  blocks: EmailContentBlock[];
  readOnly: boolean;
  selectedBlockIndex: number;
}

const EmailSettings: FC<EmailSettingsProps> = ({
  blocks,
  readOnly,
  selectedBlockIndex,
}) => {
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<'outline' | 'preview'>('outline');
  const boxRef = useRef<HTMLElement>();

  useEffect(() => {
    boxRef.current?.children[selectedBlockIndex]?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [selectedBlockIndex]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <TabContext value={activeTab}>
        <TabList onChange={(ev, newValue) => setActiveTab(newValue)}>
          <Tab
            label={messages.editor.settings.tabs.outline()}
            sx={{ marginLeft: 2 }}
            value="outline"
          />
          <Tab
            label={messages.editor.settings.tabs.preview.title()}
            value="preview"
          />
        </TabList>
        <TabPanel
          sx={{
            flexGrow: 0,
            overflowY: 'auto',
            padding: 0,
          }}
          value="outline"
        >
          <Stack ref={boxRef} divider={<Divider />} sx={{ paddingTop: 1 }}>
            {blocks.map((block, index) => (
              <BlockListItem
                key={`${block.kind}-${index}`}
                block={block}
                selected={!readOnly && index == selectedBlockIndex}
              />
            ))}
          </Stack>
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="preview">
          <PreviewTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default EmailSettings;
