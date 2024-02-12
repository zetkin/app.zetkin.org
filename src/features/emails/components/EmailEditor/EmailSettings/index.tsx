import EditorJS from '@editorjs/editorjs';
import { OutputBlockData } from '@editorjs/editorjs';
import { Box, Divider, Stack, Tab, useTheme } from '@mui/material';
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import BlockListItem from './BlockListItem';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface EmailSettingsProps {
  apiRef: MutableRefObject<EditorJS | null>;
  blocks: OutputBlockData[];
  selectedBlockIndex: number;
}

const EmailSettings: FC<EmailSettingsProps> = ({
  apiRef,
  blocks,
  selectedBlockIndex,
}) => {
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<'Content'>('Content');
  const boxRef = useRef<HTMLElement>();
  const theme = useTheme();

  useEffect(() => {
    boxRef.current?.children[selectedBlockIndex]?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [selectedBlockIndex]);

  return (
    <Box
      sx={{
        borderLeft: `1px solid ${theme.palette.grey[300]}`,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <TabContext value={activeTab}>
        <TabList
          onChange={(ev, newValue) => setActiveTab(newValue)}
          sx={{ border: 'none' }}
        >
          <Tab
            label={messages.editor.settings.tabs.content()}
            value="content"
          />
          <Tab
            label={messages.editor.settings.tabs.settings()}
            value="settings"
          />
          <Tab
            label={messages.editor.settings.tabs.preview()}
            value="preview"
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
          <Stack ref={boxRef} divider={<Divider />} sx={{ paddingTop: 1 }}>
            {blocks.map((block, index) => (
              <BlockListItem
                key={block.id}
                block={block}
                onChange={(newData: OutputBlockData['data']) => {
                  if (block.id) {
                    apiRef.current?.blocks.update(block.id, newData);
                  }
                }}
                selected={index === selectedBlockIndex}
              />
            ))}
          </Stack>
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="settings">
          Foo
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="preview">
          Bar
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default EmailSettings;
