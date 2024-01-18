import { Box, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import { ButtonData } from '.';
import ContentEditable from 'react-contenteditable';
import DOMPurify from 'dompurify';

interface ButtonEditableBlockProps {
  data: ButtonData;
  onChange: (newButtonText: string) => void;
}

const ButtonEditableBlock: FC<ButtonEditableBlockProps> = ({
  data,
  onChange,
}) => {
  const theme = useTheme();
  const [test, setTest] = useState(data.buttonText || 'Add text');

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
          html={test}
          onChange={(ev) => {
            const cleanHtml = DOMPurify.sanitize(ev.currentTarget.innerHTML, {
              ALLOWED_TAGS: [],
            });
            setTest(cleanHtml);
            onChange(cleanHtml);
          }}
        />
      </Box>
    </Box>
  );
};

export default ButtonEditableBlock;
