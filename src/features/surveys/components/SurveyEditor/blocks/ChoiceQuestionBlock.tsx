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

import theme from 'theme';
import { ZetkinOptionsQuestion } from 'utils/types/zetkin';

interface ChoiceQuestionBlockProps {
  inEditMode: boolean;
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
  question: ZetkinOptionsQuestion;
}

const ChoiceQuestionBlock: FC<ChoiceQuestionBlockProps> = ({
  inEditMode,
  onEditModeEnter,
  onEditModeExit,
  question: questionElement,
}) => {
  const intl = useIntl();

  const [question, setQuestion] = useState(questionElement.question);
  const [description, setDescription] = useState(questionElement.description);

  const [focus, setFocus] = useState<'description' | null>(null);

  const descriptionRef = useRef<HTMLInputElement>(null);

  const questionRef = useCallback((node: HTMLInputElement) => {
    node?.focus();
  }, []);

  useEffect(() => {
    if (focus === 'description') {
      const input = descriptionRef.current;
      input?.focus();
    }
  }, [focus]);

  const handleKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter') {
      onEditModeExit();
      setFocus(null);
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        onEditModeExit();
        setFocus(null);
      }}
    >
      {inEditMode ? (
        <Box display="flex" flexDirection="column">
          <TextField
            InputProps={{
              inputRef: questionRef,
              sx: { fontSize: theme.typography.h4.fontSize },
            }}
            label={intl.formatMessage({
              id: 'misc.surveys.blocks.common.title',
            })}
            onChange={(evt) => setQuestion(evt.target.value)}
            onKeyDown={(evt) => handleKeyDown(evt)}
            sx={{ paddingBottom: 2 }}
            value={question}
          />
          <TextField
            InputProps={{ inputRef: descriptionRef }}
            label={intl.formatMessage({
              id: 'misc.surveys.blocks.common.description',
            })}
            onChange={(evt) => setDescription(evt.target.value)}
            onKeyDown={(evt) => handleKeyDown(evt)}
            sx={{ paddingBottom: 2 }}
            value={description}
          />
        </Box>
      ) : (
        <Box onClick={onEditModeEnter}>
          <Typography color={question ? 'inherit' : 'secondary'} variant="h4">
            {question ? (
              questionElement.question
            ) : (
              <Msg id="misc.surveys.blocks.common.empty" />
            )}
          </Typography>
          {question && (
            <Typography
              onClick={() => setFocus('description')}
              sx={{ paddingTop: 1 }}
            >
              {questionElement.description}
            </Typography>
          )}
        </Box>
      )}
    </ClickAwayListener>
  );
};

export default ChoiceQuestionBlock;
