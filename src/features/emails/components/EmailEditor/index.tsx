import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  TextField,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';

import { useMessages } from 'core/i18n';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';
import messageIds from 'features/emails/l10n/messageIds';
import { EmailContentBlock } from 'features/emails/types';
import { ZetkinEmail, ZetkinEmailPostBody } from 'utils/types/zetkin';
import ZUIEditor from 'zui/ZUIEditor';
import EmailSettings from './EmailSettings';

type EmailEditorProps = {
  email: ZetkinEmail;
  onSave: (email: Partial<ZetkinEmailPostBody>) => void;
  readOnly: boolean;
};

const EmailEditor: FC<EmailEditorProps> = ({ email, onSave, readOnly }) => {
  const theme = useTheme();
  const initialContent = email.content
    ? JSON.parse(email.content)
    : [{ blocks: [] }];
  const messages = useMessages(messageIds);
  const [content, setContent] = useState<EmailContentBlock[]>(
    initialContent.blocks
  );
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);
  const [subject, setSubject] = useState(email.subject || '');
  const configs = useEmailConfigs(email.organization.id).data || [
    email?.config,
  ];

  return (
    <Box display="flex" height="100%" width="100%">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        sx={{ overflowY: 'auto' }}
        width="70%"
      >
        <Box mx={2}>
          <Box display="flex" gap={2} py={2}>
            <FormControl fullWidth sx={{ flex: 2 }}>
              <TextField
                disabled={readOnly}
                fullWidth
                label={messages.editor.settings.tabs.settings.senderInputLabel()}
                onChange={(ev) => {
                  const configId = parseInt(ev.target.value);
                  if (!isNaN(configId)) {
                    onSave({ config_id: configId });
                  }
                }}
                select
                size="small"
                value={email.config.id}
              >
                {configs.map((config) => (
                  <MenuItem key={config.id} value={config.id}>
                    {`${config.sender_name} (${config.sender_email})`}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <TextField
              disabled={readOnly}
              fullWidth
              label={messages.editor.settings.tabs.settings.subjectInputLabel()}
              onChange={(event) => {
                setSubject(event.target.value);
                onSave({ subject: event.target.value });
              }}
              size="small"
              sx={{ flex: 3 }}
              value={subject}
            />
          </Box>
          <Divider />
        </Box>
        <ZUIEditor
          content={content}
          editable={true}
          enableBold
          enableButton
          enableHeading
          enableImage
          enableItalic
          enableLink
          enableVariable
          onChange={(newContent) => {
            setContent(newContent);
            onSave({
              content: JSON.stringify({
                blocks: newContent,
              }),
            });
          }}
          onSelectBlock={(selectedBlockIndex) => {
            setSelectedBlockIndex(selectedBlockIndex);
          }}
        />
      </Box>
      <Box
        sx={{
          borderLeft: `1px solid ${theme.palette.divider}`,
          maxHeight: '100%',
          overflowY: 'auto',
        }}
        width="30%"
      >
        <EmailSettings
          blocks={content}
          readOnly={readOnly}
          selectedBlockIndex={selectedBlockIndex}
        />
      </Box>
    </Box>
  );
};

export default EmailEditor;
