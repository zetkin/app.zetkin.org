import { useIntl } from 'react-intl';
import { Box, ClickAwayListener, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';

import theme from 'theme';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

interface TextBlockProps {
  element: ZetkinSurveyTextElement;
  isMostRecent: boolean;
  onSave: (textBlock: { content: string; header: string }) => void; //Pick<ZetkinSurveyTextElement, 'text_block'>
}

const TextBlock: FC<TextBlockProps> = ({ element, isMostRecent, onSave }) => {
  const intl = useIntl();
  const [header, setHeader] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(!isMostRecent);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setPreview(true);
        onSave({
          content,
          header: header
            ? header
            : intl.formatMessage({ id: 'misc.surveys.blocks.text.header' }),
        });
      }}
    >
      {preview ? (
        <Box onClick={() => setPreview(false)}>
          <Typography
            color={
              element.text_block.header ===
              intl.formatMessage({ id: 'misc.surveys.blocks.text.header' })
                ? 'secondary'
                : 'black'
            }
            variant="h4"
          >
            {element.text_block.header}
          </Typography>
          <Typography
            color={
              element.text_block.content ===
              intl.formatMessage({ id: 'misc.surveys.blocks.text.content' })
                ? 'secondary'
                : 'black'
            }
            sx={{ paddingTop: 1 }}
          >
            {element.text_block.content}
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column">
          <TextField
            InputProps={{ sx: { fontSize: theme.typography.h4.fontSize } }}
            label={intl.formatMessage({
              id: 'misc.surveys.blocks.text.header',
            })}
            onChange={(evt) => setHeader(evt.target.value)}
            sx={{ paddingBottom: 2 }}
            value={header}
          />
          <TextField
            label={intl.formatMessage({
              id: 'misc.surveys.blocks.text.content',
            })}
            onChange={(evt) => setContent(evt.target.value)}
            value={content}
          />
        </Box>
      )}
    </ClickAwayListener>
  );
};

export default TextBlock;
