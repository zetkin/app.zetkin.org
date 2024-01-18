import { Box, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import { ButtonData } from '.';
import ContentEditable from 'react-contenteditable';
import DOMPurify from 'dompurify';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface ButtonEditableBlockProps {
  data: ButtonData;
  onChange: (newButtonText: string) => void;
}

const ButtonEditableBlock: FC<ButtonEditableBlockProps> = ({
  data,
  onChange,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [buttonText, setButtonText] = useState(
    data.buttonText || messages.tools.button.block.noButtonText()
  );

  return (
    <Box display="flex" justifyContent="center" padding={2}>
      <Box
        alignItems="center"
        bgcolor={theme.palette.primary.main}
        color="white"
        display="flex"
        justifyContent="center"
        padding={2}
      >
        <ContentEditable
          html={buttonText}
          onChange={(ev) => {
            const cleanHtml = DOMPurify.sanitize(ev.currentTarget.innerHTML, {
              ALLOWED_TAGS: [],
            });
            setButtonText(cleanHtml);
            onChange(cleanHtml);
          }}
          style={{ outline: 'none' }}
        />
      </Box>
    </Box>
  );
};

export default ButtonEditableBlock;
