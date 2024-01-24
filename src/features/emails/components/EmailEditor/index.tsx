import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import EditorJS, { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { FC, useEffect, useRef, useState } from 'react';

import { BLOCK_TYPES } from 'features/emails/types';
import EmailSettings from './EmailSettings';

const EmailEditorFrontend = dynamic(import('./EmailEditorFrontend'), {
  ssr: false,
});

interface EmailEditorProps {
  initialContent: OutputData;
  onSave: (data: OutputData) => void;
}

const EmailEditor: FC<EmailEditorProps> = ({ initialContent, onSave }) => {
  const apiRef = useRef<EditorJS | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [content, setContent] = useState<OutputData>(initialContent);

  const blocksRef = useRef<OutputBlockData[]>();

  useEffect(() => {
    if (
      blocksRef.current !== undefined &&
      blocksRef.current.length < content.blocks.length
    ) {
      for (let i = 0; i < blocksRef.current.length; i++) {
        const block = blocksRef.current[i];
        if (block.id != content.blocks[i].id) {
          if (content.blocks[i].type === BLOCK_TYPES.PARAGRAPH) {
            //If the added block is a text block - do nothing.
            break;
          } else {
            setSelectedBlockIndex(i);
            break;
          }
        }
      }
    }
    blocksRef.current = content.blocks;
  }, [content.blocks.length]);

  return (
    <Box display="flex" height="100%">
      <Box flex={1} sx={{ overflowY: 'auto' }}>
        <EmailEditorFrontend
          apiRef={apiRef}
          initialContent={initialContent}
          onChange={(newContent: OutputData) => {
            setContent(newContent);
          }}
          onSave={onSave}
          onSelectBlock={(selectedBlockIndex: number) => {
            setSelectedBlockIndex(selectedBlockIndex);
          }}
        />
      </Box>
      <Box sx={{ overflowY: 'auto' }} width="25%">
        <EmailSettings
          apiRef={apiRef}
          blocks={content.blocks}
          selectedBlockIndex={selectedBlockIndex}
        />
      </Box>
    </Box>
  );
};

export default EmailEditor;
