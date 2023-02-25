import { Box, ClickAwayListener, TextField, Typography } from '@mui/material';
import {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import DeleteHideButtons from './DeleteHideButtons';
import theme from 'theme';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

interface TextBlockProps {
  hidden: boolean;
  inEditMode: boolean;
  element: ZetkinSurveyTextElement;
  onDelete: () => void;
  onEditModeEnter: () => void;
  onEditModeExit: (textBlock: ZetkinSurveyTextElement['text_block']) => void;
  onToggleHidden: (hidden: boolean) => void;
}

const TextBlock: FC<TextBlockProps> = ({
  hidden,
  inEditMode,
  onDelete,
  element,
  onEditModeEnter,
  onEditModeExit,
  onToggleHidden,
}) => {
  const intl = useIntl();
  const [header, setHeader] = useState(element.text_block.header);
  const [content, setContent] = useState(element.text_block.content);

  const [focus, setFocus] = useState<'content' | null>(null);

  const contentRef = useRef<HTMLInputElement>(null);

  const headerRef = useCallback((node: HTMLInputElement) => {
    node?.focus();
  }, []);

  useEffect(() => {
    if (focus === 'content') {
      const input = contentRef.current;
      input?.focus();
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
      <div>
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
            <Typography color={header ? 'inherit' : 'secondary'} variant="h4">
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
        <Box display="flex" justifyContent="end" m={2}>
          <DeleteHideButtons
            hidden={hidden}
            onDelete={onDelete}
            onToggleHidden={onToggleHidden}
          />
        </Box>
      </div>
    </ClickAwayListener>
  );
};

export default TextBlock;
