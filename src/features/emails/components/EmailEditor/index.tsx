import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import EditorJS, { BlockAPI, OutputData } from '@editorjs/editorjs';
import { FC, useRef, useState } from 'react';

const EmailEditorFrontend = dynamic(import('./EmailEditorFrontend'), {
  ssr: false,
});

interface EmailEditorProps {
  initialContent: OutputData;
  onSave: (data: OutputData) => void;
}

const EmailEditor: FC<EmailEditorProps> = ({ initialContent, onSave }) => {
  const apiRef = useRef<EditorJS | null>(null);
  const [currentBlock, setCurrentBlock] = useState<BlockAPI | null>(null);

  return (
    <Box display="flex">
      <Box flex={1}>
        <EmailEditorFrontend
          apiRef={apiRef}
          initialContent={initialContent}
          onChange={() => {
            //TODO: logic here
          }}
          onSave={onSave}
          onSelectBlock={(selectedBlock: BlockAPI) => {
            if (!currentBlock || currentBlock.id !== selectedBlock.id) {
              setCurrentBlock(selectedBlock);
            }
          }}
        />
      </Box>
      <Box padding={2} width="25%">
        <Typography>Settings</Typography>
        {currentBlock && <Typography>{currentBlock.name}</Typography>}
      </Box>
    </Box>
  );
};

export default EmailEditor;
