import AbcIcon from '@mui/icons-material/Abc';
import { FormattedMessage as Msg } from 'react-intl';
import SortIcon from '@mui/icons-material/Sort';
import theme from 'theme';
import { useIntl } from 'react-intl';
import { ZetkinTextQuestion } from 'utils/types/zetkin';
import {
  BaseSyntheticEvent,
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  ClickAwayListener,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

type TextQuestionPatchBody = Omit<ZetkinTextQuestion, 'required'>;

interface OpenQuestionBlockProps {
  element: ZetkinTextQuestion;
  inEditMode: boolean;
  onEditModeEnter: () => void;
  onEditModeExit: (question: TextQuestionPatchBody) => void;
}

enum FIELDTYPE {
  MULTILINE = 'multiLine',
  SINGLELINE = 'singleLine',
}

const OpenQuestionBlock: FC<OpenQuestionBlockProps> = ({
  element,
  inEditMode,
  onEditModeEnter,
  onEditModeExit,
}) => {
  const intl = useIntl();

  const [typeField, setTypeField] = useState(
    element.response_config.multiline === true
      ? FIELDTYPE.MULTILINE
      : FIELDTYPE.SINGLELINE
  );

  const [title, setTitle] = useState(element.question);
  const [description, setDescription] = useState(element.description);

  const [responseConfig, setResponseConfig] = useState(
    element.response_config.multiline
  );
  const [focus, setFocus] = useState<
    'title' | 'description' | 'responseConfig' | null
  >(null);

  const titleRef = useCallback((node: HTMLInputElement) => {
    node?.focus();
  }, []);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const typeConfigRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus === 'description') {
      const input = descriptionRef.current;
      input?.focus();
    } else if (focus === 'responseConfig') {
      const input = typeConfigRef.current;
      input?.focus();
    }
  }, [focus]);

  const handleKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter') {
      const element = createElementToUpdate();
      onEditModeExit(element);
      setFocus(null);
    }
  };

  const handleSelect = (event: BaseSyntheticEvent) => {
    setTypeField(event.target.value);
  };

  const createElementToUpdate = () => {
    const elemenToUpdate: TextQuestionPatchBody = {
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
      {inEditMode ? (
        <Box display="flex" flexDirection="column">
          <TextField
            defaultValue={element.question}
            fullWidth
            InputProps={{
              inputRef: titleRef,
              sx: { fontSize: theme.typography.h4.fontSize },
            }}
            label={intl.formatMessage({
              id: 'misc.surveys.blocks.text.header',
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
              id: 'misc.surveys.blocks.text.content',
            })}
            margin="normal"
            onChange={(ev) => setDescription(ev.target.value)}
            onKeyDown={(evt) => handleKeyDown(evt)}
          />
          <TextField
            defaultValue={
              element.response_config.multiline === true
                ? FIELDTYPE.MULTILINE
                : FIELDTYPE.SINGLELINE
            }
            fullWidth
            InputProps={{ inputRef: typeConfigRef }}
            label={intl.formatMessage({
              id: 'misc.surveys.blocks.text.textFieldType',
            })}
            margin="normal"
            onChange={(event) => {
              handleSelect(event),
                setResponseConfig(
                  event.target.value === FIELDTYPE.MULTILINE ? true : false
                );
            }}
            select
            SelectProps={{
              MenuProps: { disablePortal: true },
            }}
            sx={{ alignItems: 'center', display: 'flex' }}
            value={typeField}
          >
            {Object.values(FIELDTYPE).map((value) => (
              <MenuItem key={value} value={value}>
                {value === 'singleLine' ? (
                  <AbcIcon sx={{ marginRight: '10px' }} />
                ) : (
                  <SortIcon sx={{ marginRight: '10px' }} />
                )}
                <Msg id={`misc.surveys.blocks.text.${value}`} />
              </MenuItem>
            ))}
          </TextField>
        </Box>
      ) : (
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
              <Msg id="misc.surveys.blocks.text.empty" />
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
              <Msg id="misc.surveys.blocks.text.content" />
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
                <Msg id="misc.surveys.blocks.text.multiLine" />{' '}
                <Msg id="misc.surveys.blocks.text.fieldTypePreview" />
              </>
            ) : (
              <>
                <AbcIcon sx={{ marginRight: '10px' }} />
                <Msg id="misc.surveys.blocks.text.singleLine" />{' '}
                <Msg id="misc.surveys.blocks.text.fieldTypePreview" />
              </>
            )}
          </Typography>
        </Box>
      )}
    </ClickAwayListener>
  );
};

export default OpenQuestionBlock;
