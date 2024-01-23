import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { FC, useRef, useState } from 'react';

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
