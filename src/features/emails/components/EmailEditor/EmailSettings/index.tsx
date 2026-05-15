import { Box, Divider, Stack, Tab } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useDrag, useDrop } from 'react-dnd';

import messageIds from 'features/emails/l10n/messageIds';
import PreviewTab from './PreviewTab';
import { useMessages } from 'core/i18n';
import BlockListItem from './BlockListItem';
import { EmailContentBlock } from 'features/emails/types';

interface EmailSettingsProps {
  blocks: EmailContentBlock[];
  moveBlock: (fromIndex: number, toIndex: number) => void;
  readOnly: boolean;
  selectedBlockIndex: number;
  setSelectedBlockIndex: (index: number) => void;
}

interface DragItem {
  index: number;
  type: string;
}

const EmailSettings: FC<EmailSettingsProps> = ({
  blocks,
  moveBlock,
  readOnly,
  selectedBlockIndex,
  setSelectedBlockIndex,
}) => {
  const messages = useMessages(messageIds);
  const [activeTab, setActiveTab] = useState<'outline' | 'preview'>('outline');
  const boxRef = useRef<HTMLDivElement | null>(null);

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
              <DraggableBlockListItem
                key={`${block.kind}-${index}`}
                block={block}
                index={index}
                moveBlock={moveBlock}
                readOnly={readOnly}
                selectedBlockIndex={selectedBlockIndex}
                setSelectedBlockIndex={setSelectedBlockIndex}
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

interface DraggableBlockListItemProps {
  block: EmailContentBlock;
  index: number;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  readOnly: boolean;
  selectedBlockIndex: number;
  setSelectedBlockIndex: (index: number) => void;
}

const DraggableBlockListItem: FC<DraggableBlockListItemProps> = ({
  block,
  index,
  moveBlock,
  readOnly,
  selectedBlockIndex,
  setSelectedBlockIndex,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    canDrag: !readOnly,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { index, type: 'BLOCK' },
    type: 'BLOCK',
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: 'BLOCK',
    canDrop: () => !readOnly,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: DragItem) => {
      if (item.index === index) {
        return;
      }
      const draggedIndex = item.index;
      const targetIndex = index;
      let newIndex: number;

      if (draggedIndex < targetIndex) {
        newIndex = targetIndex - 1;
      } else {
        newIndex = targetIndex;
      }

      if (draggedIndex !== newIndex) {
        moveBlock(draggedIndex, newIndex);
      }
    },
  });

  drag(dropRef);
  drop(dropRef);

  return (
    <BlockListItem
      block={block}
      dropRef={dropRef}
      isDragging={isDragging}
      isOver={isOver}
      onSelect={() => setSelectedBlockIndex(index)}
      selected={!readOnly && index === selectedBlockIndex}
    />
  );
};

export default EmailSettings;
