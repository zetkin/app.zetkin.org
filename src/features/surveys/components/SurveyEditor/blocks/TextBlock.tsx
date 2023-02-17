import { Box, ClickAwayListener, TextField, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import theme from 'theme';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

interface TextBlockProps {
  element: ZetkinSurveyTextElement;
  isMostRecent: boolean;
  onSave: (textBlock: { content: string; header: string }) => void; //Pick<ZetkinSurveyTextElement, 'text_block'>
}

const TextBlock: FC<TextBlockProps> = ({ element, isMostRecent, onSave }) => {
  const intl = useIntl();
  const [header, setHeader] = useState(element.text_block.header);
  const [content, setContent] = useState(element.text_block.content);
  const [preview, setPreview] = useState(!isMostRecent);

  const [focusHeader, setFocusHeader] = useState(true);
  const [focusContent, setFocusContent] = useState(false);

  const headerRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusHeader) {
      headerRef.current?.focus();
    }
  }, [focusHeader]);

  useEffect(() => {
    if (focusContent) {
      contentRef.current?.focus();
    }
  }, [focusContent]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        onSave({
          content,
          header,
        });
        setPreview(true);
        setFocusHeader(false);
        setFocusContent(false);
      }}
    >
      {preview ? (
        <Box onClick={() => setPreview(false)}>
          <Typography
            color={header ? 'inherit' : 'secondary'}
            onClick={() => setFocusHeader(true)}
            variant="h4"
          >
            {header ? (
              element.text_block.header
            ) : (
              <Msg id="misc.surveys.blocks.text.empty" />
            )}
          </Typography>
          {content && (
            <Typography
              onClick={() => setFocusContent(true)}
              sx={{ paddingTop: 1 }}
            >
              {element.text_block.content}
            </Typography>
          )}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column">
          <TextField
            InputProps={{
              inputRef: headerRef,
              sx: { fontSize: theme.typography.h4.fontSize },
            }}
            label={intl.formatMessage({
              id: 'misc.surveys.blocks.text.header',
            })}
            onChange={(evt) => setHeader(evt.target.value)}
            sx={{ paddingBottom: 2 }}
            value={header}
          />
          <TextField
            InputProps={{ inputRef: contentRef }}
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
