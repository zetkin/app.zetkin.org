import { Edit } from '@mui/icons-material';
import EditorJS from '@editorjs/editorjs';
import { OutputBlockData } from '@editorjs/editorjs';
import { Box, Divider, Stack, Tab } from '@mui/material';
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import BlockListItem from './BlockListItem';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg } from 'core/i18n';

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
  const [activeTab, setActiveTab] = useState<'Content'>('Content');
  const boxRef = useRef<HTMLElement>();

  useEffect(() => {
    boxRef.current?.children[selectedBlockIndex]?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [selectedBlockIndex]);

  return (
    <TabContext value={activeTab}>
      <TabList onChange={(ev, newValue) => setActiveTab(newValue)}>
        <Tab
          label={
            <Box alignItems="center" display="flex">
              <Edit fontSize="small" sx={{ marginRight: 1 }} />
              <Msg id={messageIds.editor.settings.tabs.content} />
            </Box>
          }
          value="Content"
        />
      </TabList>
      <TabPanel sx={{ padding: 0 }} value="Content">
        <Stack ref={boxRef} divider={<Divider />}>
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
    </TabContext>
  );
};

export default EmailSettings;
