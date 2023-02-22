import AbcIcon from '@mui/icons-material/Abc';
import { FormattedMessage as Msg } from 'react-intl';
import SortIcon from '@mui/icons-material/Sort';
import { useIntl } from 'react-intl';
import { ZetkinTextQuestion } from 'utils/types/zetkin';
import {
  Box,
  ClickAwayListener,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

interface OpenQuestionBlockProps {
  element: ZetkinTextQuestion;
  inEditMode: boolean;
  onEditModeEnter: () => void;
  onEditModeExit: (question: Omit<ZetkinTextQuestion, 'required'>) => void;
}

enum fieldType {
  multiLine = 'multiLine',
  singleLine = 'singleLine',
}

type elementWithoutRequired = Omit<ZetkinTextQuestion, 'required'>;

const OpenQuestionBlock: FC<OpenQuestionBlockProps> = ({
  element,
  inEditMode,
  onEditModeEnter,
  onEditModeExit,
}) => {
  const intl = useIntl();

  const [typeField, setTypeField] = useState(
    element.response_config.multiline === true
      ? fieldType.multiLine
      : fieldType.singleLine
  );

  const [title, setTitle] = useState(element.question);
  const [description, setDescription] = useState(element.description);

  const [responseConfig, setResponseConfig] = useState(
    element.response_config.multiline
  );
  const [focus, setFocus] = useState<
    'title' | 'description' | 'responseConfig' | null
  >(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const typeConfigRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus === 'title') {
      const input = titleRef.current;
      input?.focus();
    } else if (focus === 'description') {
      const input = descriptionRef.current;
      input?.focus();
    } else {
      const input = typeConfigRef.current;
      input?.focus();
    }
  }, [focus]);

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter') {
      const elementWithout: elementWithoutRequired = {
        description: description,
        question: title,
        response_config: { multiline: responseConfig },
        response_type: element.response_type,
      };
      onEditModeExit(elementWithout);
      setFocus(null);
    }
  };

  const handleSelect = (event: React.BaseSyntheticEvent) => {
    setTypeField(event.target.value);
  };

  const createElementToUpdate = () => {
    const elemenToUpdate: elementWithoutRequired = {
      description: description,
      question: title,
      response_config: { multiline: responseConfig },
      response_type: element.response_type,
    };
    return elemenToUpdate;
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        const element = createElementToUpdate();
        onEditModeExit(element);
        setFocus(null);
      }}
    >
      {!inEditMode ? (
        <Box onClick={() => onEditModeEnter()}>
          <Typography
            component="h4"
            marginBottom={2}
            onClick={() => setFocus('title')}
            variant="h4"
          >
            {element.question ? (
              element.question
            ) : (
              <Msg id="pages.organizeSurvey.openQuestion.titlePreview" />
            )}
          </Typography>
          <Typography
            component="h5"
            marginBottom={2}
            onClick={() => setFocus('description')}
            variant="h5"
          >
            {element.description ? (
              element.description
            ) : (
              <Msg id="pages.organizeSurvey.openQuestion.description" />
            )}
          </Typography>
          <Typography
            component="h5"
            marginBottom={2}
            onClick={() => setFocus('responseConfig')}
            variant="h5"
          >
            {element.response_config.multiline ? (
              <>
                <SortIcon sx={{ marginRight: '10px' }} />
                <Msg id="pages.organizeSurvey.openQuestion.multiLine" />{' '}
                <Msg id="pages.organizeSurvey.openQuestion.fieldTypePreview" />
              </>
            ) : (
              <>
                <AbcIcon sx={{ marginRight: '10px' }} />
                <Msg id="pages.organizeSurvey.openQuestion.singleLine" />{' '}
                <Msg id="pages.organizeSurvey.openQuestion.fieldTypePreview" />
              </>
            )}
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column">
          <TextField
            defaultValue={element.question}
            fullWidth
            InputProps={{
              inputRef: titleRef,
            }}
            label={intl.formatMessage({
              id: 'pages.organizeSurvey.openQuestion.title',
            })}
            margin="normal"
            onChange={(ev) => setTitle(ev.target.value)}
            onKeyDown={(evt) => handleKeyDown(evt)}
          />
          <TextField
            defaultValue={element.description}
            fullWidth
            InputProps={{ inputRef: descriptionRef }}
            label={intl.formatMessage({
              id: 'pages.organizeSurvey.openQuestion.description',
            })}
            margin="normal"
            onChange={(ev) => setDescription(ev.target.value)}
            onKeyDown={(evt) => handleKeyDown(evt)}
          />
          <TextField
            defaultValue={
              element.response_config.multiline === true
                ? fieldType.multiLine
                : fieldType.singleLine
            }
            fullWidth
            InputProps={{ inputRef: typeConfigRef }}
            label={intl.formatMessage({
              id: 'pages.organizeSurvey.openQuestion.textFieldType',
            })}
            margin="normal"
            onChange={(event) => {
              handleSelect(event),
                setResponseConfig(
                  event.target.value === fieldType.multiLine ? true : false
                );
            }}
            select
            SelectProps={{
              MenuProps: { disablePortal: true },
            }}
            sx={{ alignItems: 'center', display: 'flex' }}
            value={typeField}
          >
            {Object.values(fieldType).map((value) => (
              <MenuItem key={value} value={value}>
                {value === 'singleLine' ? (
                  <AbcIcon sx={{ marginRight: '10px' }} />
                ) : (
                  <SortIcon sx={{ marginRight: '10px' }} />
                )}
                <Msg id={`pages.organizeSurvey.openQuestion.${value}`} />
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    </ClickAwayListener>
  );
};

export default OpenQuestionBlock;
