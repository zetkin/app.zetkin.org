import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { FC, useRef, useState } from 'react';

import { ButtonData } from './tools/Button';
import ButtonSettings from './tools/Button/ButtonSettings';

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

  const currentBlock = content.blocks[selectedBlockIndex];

  return (
    <Box display="flex">
      <Box flex={1}>
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
      <Box padding={2} width="25%">
        <Typography>Settings</Typography>
        {currentBlock && currentBlock.type === 'button' && (
          <ButtonSettings
            onChange={(newUrl: ButtonData['url']) => {
              if (currentBlock.id) {
                apiRef.current?.blocks.update(currentBlock.id, {
                  ...currentBlock.data,
                  url: newUrl,
                });
              }
            }}
            url={currentBlock.data.url}
          />
        )}
      </Box>
    </Box>
  );
};

export default EmailEditor;
