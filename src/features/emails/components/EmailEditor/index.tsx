import dynamic from 'next/dynamic';
import { Alert, Box, useTheme } from '@mui/material';
import EditorJS, { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { FC, useEffect, useRef, useState } from 'react';

import EmailSettings from './EmailSettings';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinEmail } from 'utils/types/zetkin';

const EmailEditorFrontend = dynamic(() => import('./EmailEditorFrontend'), {
  ssr: false,
});

interface EmailEditorProps {
  email: ZetkinEmail;
  onSave: (email: Partial<ZetkinEmail>) => void;
}

const EmailEditor: FC<EmailEditorProps> = ({ email, onSave }) => {
  const theme = useTheme();
  const apiRef = useRef<EditorJS | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);

  const initialContent = email.content
    ? JSON.parse(email.content)
    : { blocks: [] };
  const [content, setContent] = useState<OutputData>(initialContent);

  const blocksRef = useRef<OutputBlockData[]>();

  const readOnly = !!email.published;

  useEffect(() => {
    if (
      blocksRef.current !== undefined &&
      blocksRef.current.length < content.blocks.length
    ) {
      for (let i = 0; i < blocksRef.current.length; i++) {
        const block = blocksRef.current[i];
        if (block.id != content.blocks[i].id) {
          setSelectedBlockIndex(i);
          break;
        }
      }
    }
    blocksRef.current = content.blocks;
  }, [content.blocks.length]);

  return (
    <Box display="flex" flexDirection="column">
      {readOnly && (
        <Alert severity="info" sx={{ marginBottom: 2 }}>
          <Msg id={messageIds.editor.readOnlyModeInfo} />
        </Alert>
      )}
      <Box display="flex" height="100%">
        <Box flex={1} sx={{ overflowY: 'auto' }}>
          <EmailEditorFrontend
            apiRef={apiRef}
            initialContent={initialContent}
            onSave={(newContent: OutputData) => {
              setContent(newContent);
              onSave({ content: JSON.stringify(newContent) });
            }}
            onSelectBlock={(selectedBlockIndex: number) => {
              setSelectedBlockIndex(selectedBlockIndex);
            }}
            readOnly={readOnly}
          />
        </Box>
        <Box
          sx={{
            borderLeft: `1px solid ${theme.palette.grey[300]}`,
            overflowY: 'auto',
          }}
          width="25%"
        >
          <EmailSettings
            apiRef={apiRef}
            blocks={content.blocks}
            onSave={onSave}
            readOnly={readOnly}
            selectedBlockIndex={selectedBlockIndex}
            subject={email.subject || ''}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EmailEditor;
