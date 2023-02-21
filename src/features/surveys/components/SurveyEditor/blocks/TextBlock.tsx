import { Box, ClickAwayListener, TextField, Typography } from '@mui/material';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import theme from 'theme';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

interface TextBlockProps {
  inEditMode: boolean;
  element: ZetkinSurveyTextElement;
  onEditModeEnter: () => void;
  onEditModeExit: (textBlock: ZetkinSurveyTextElement['text_block']) => void;
}

const TextBlock: FC<TextBlockProps> = ({
  inEditMode,
  element,
  onEditModeEnter,
  onEditModeExit,
}) => {
  const intl = useIntl();
  const [header, setHeader] = useState(element.text_block.header);
  const [content, setContent] = useState(element.text_block.content);

  const [focus, setFocus] = useState<'content' | 'header' | null>(null);

  const headerRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus === 'content') {
      contentRef.current?.focus();
    }
    if (focus === 'header') {
      headerRef.current?.focus();
    }
  }, [focus]);

  const handleKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter') {
      onEditModeExit({
        content,
        header,
      });
      setFocus(null);
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        onEditModeExit({
          content,
          header,
        });

        setFocus(null);
      }}
    >
      {inEditMode ? (
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
            onKeyDown={(evt) => handleKeyDown(evt)}
            sx={{ paddingBottom: 2 }}
            value={header}
          />
          <TextField
            InputProps={{ inputRef: contentRef }}
            label={intl.formatMessage({
              id: 'misc.surveys.blocks.text.content',
            })}
            onChange={(evt) => setContent(evt.target.value)}
            onKeyDown={(evt) => handleKeyDown(evt)}
            value={content}
          />
        </Box>
      ) : (
        <Box onClick={() => onEditModeEnter()}>
          <Typography
            color={header ? 'inherit' : 'secondary'}
            onClick={() => setFocus('header')}
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
              onClick={() => setFocus('content')}
              sx={{ paddingTop: 1 }}
            >
              {element.text_block.content}
            </Typography>
          )}
        </Box>
      )}
    </ClickAwayListener>
  );
};

export default TextBlock;
