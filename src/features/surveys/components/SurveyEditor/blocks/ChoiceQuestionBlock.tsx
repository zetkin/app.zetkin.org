import {
  Add,
  CheckBoxOutlined,
  Close,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import {
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  ListItemIcon,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
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
import { OptionsQuestionPatchBody } from 'features/surveys/repos/SurveysRepo';
import theme from 'theme';
import { ZetkinOptionsQuestion } from 'utils/types/zetkin';
import ZUIDropdownIcon from 'zui/ZUIDropdownIcon';

const enum POLL_TYPE {
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
}

export type WidgetType = {
  icon: JSX.Element;
  previewIcon: JSX.Element;
  value: POLL_TYPE;
};

const widgetTypes = {
  checkbox: {
    icon: <CheckBoxOutlined />,
    previewIcon: <CheckBoxOutlined color="secondary" />,
    value: POLL_TYPE.CHECKBOX,
  },
  radio: {
    icon: <RadioButtonChecked />,
    previewIcon: <RadioButtonUnchecked color="secondary" />,
    value: POLL_TYPE.RADIO,
  },
  select: {
    icon: <ZUIDropdownIcon />,
    previewIcon: <ZUIDropdownIcon />,
    value: POLL_TYPE.SELECT,
  },
};

interface ChoiceQuestionBlockProps {
  hidden: boolean;
  inEditMode: boolean;
  onAddOption: () => void;
  onDelete: () => void;
  onDeleteOption: (optionId: number) => void;
  onEditModeEnter: () => void;
  onEditModeExit: (question: OptionsQuestionPatchBody) => void;
  onUpdateOption: (optionId: number, text: string) => void;
  onToggleHidden: (hidden: boolean) => void;
  question: ZetkinOptionsQuestion;
}

const ChoiceQuestionBlock: FC<ChoiceQuestionBlockProps> = ({
  hidden,
  inEditMode,
  onAddOption,
  onDelete,
  onDeleteOption,
  onEditModeEnter,
  onEditModeExit,
  onToggleHidden,
  onUpdateOption,
  question: questionElement,
}) => {
  const intl = useIntl();

  const [widgetType, setWidgetType] = useState<WidgetType>(widgetTypes.radio);
  const [question, setQuestion] = useState(questionElement.question);
  const [description, setDescription] = useState(questionElement.description);
  const [focus, setFocus] = useState<'description' | number | null>(null);
  const [optionValue, setOptionValue] = useState('');

  const questionRef = useCallback((node: HTMLInputElement) => {
    node?.focus();
  }, []);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const choiceRefs = useRef<{ element: HTMLInputElement; id: number }[]>([]);

  useEffect(() => {
    if (focus === 'description') {
      const input = descriptionRef.current;
      input?.focus();
    }
  }, [focus]);

  useEffect(() => {
    if (typeof focus === 'number') {
      const choiceRef = choiceRefs.current.find((ref) => ref.id === focus);
      choiceRef?.element?.focus();
      choiceRefs.current.length = 0;
    }
  }, [choiceRefs.current]);

  const handleKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter') {
      onEditModeExit({ question: {} });
      setFocus(null);
    }
  };

  const options = questionElement.options;

  return (
    <ClickAwayListener
      onClickAway={() => {
        onEditModeExit({
          question: {
            description,
            question,
            response_config: {
              widget_type: widgetType.value,
            },
          },
        });
        setFocus(null);
        choiceRefs.current.length = 0;
      }}
    >
      <div>
        {inEditMode && (
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
              value={description}
            />
            <TextField
              defaultValue={POLL_TYPE.RADIO}
              fullWidth
              label={intl.formatMessage({
                id: 'misc.surveys.blocks.choiceQuestion.selectLabel',
              })}
              margin="normal"
              onChange={(evt) => {
                const value = evt.target.value as POLL_TYPE;
                const widgetType = Object.values(widgetTypes).find(
                  (type) => type.value === value
                );
                if (!widgetType) {
                  return;
                }
                setWidgetType(widgetType);
              }}
              select
              SelectProps={{
                MenuProps: { disablePortal: true },
              }}
              sx={{ alignItems: 'center', display: 'flex' }}
              value={widgetType.value}
            >
              {Object.values(widgetTypes).map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box alignItems="center" display="flex">
                    <ListItemIcon>{type.icon}</ListItemIcon>
                    <Msg
                      id={`misc.surveys.blocks.choiceQuestion.${type.value}`}
                    />
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <Box alignItems="center" display="flex" flexDirection="column">
              {options.map((option) => {
                return (
                  <Box
                    key={option.id}
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    paddingTop={2}
                    width="100%"
                  >
                    <Box paddingX={2}>{widgetType.previewIcon}</Box>
                    <TextField
                      fullWidth
                      inputRef={(element) => {
                        if (element) {
                          choiceRefs.current = choiceRefs.current.concat({
                            element: element,
                            id: option.id,
                          });
                        }
                      }}
                      label={intl.formatMessage({
                        id: 'misc.surveys.blocks.choiceQuestion.option',
                      })}
                      onBlur={() => onUpdateOption(option.id, optionValue)}
                      onChange={(evt) => setOptionValue(evt.target.value)}
                      sx={{ paddingLeft: 1 }}
                      value={optionValue}
                    />
                    <IconButton
                      onClick={() => onDeleteOption(option.id)}
                      sx={{ paddingX: 2 }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
        {!inEditMode && (
          <Box onClick={onEditModeEnter}>
            <Box paddingBottom={1}>
              <Typography
                color={question ? 'inherit' : 'secondary'}
                variant="h4"
              >
                {question ? (
                  questionElement.question
                ) : (
                  <Msg id="misc.surveys.blocks.choiceQuestion.empty" />
                )}
              </Typography>
              {description && (
                <Typography
                  onClick={() => setFocus('description')}
                  sx={{ paddingTop: 1 }}
                >
                  {questionElement.description}
                </Typography>
              )}
            </Box>
            {questionElement.options?.map((option) => (
              <Box
                key={option.id}
                display="flex"
                onClick={() => setFocus(option.id)}
                paddingTop={2}
              >
                <Box paddingX={2}>{widgetType.previewIcon}</Box>
                <Typography
                  color={option.text ? 'inherit' : 'secondary'}
                  fontStyle={option.text ? 'inherit' : 'italic'}
                >
                  {option.text || (
                    <Msg id="misc.surveys.blocks.choiceQuestion.emptyOption" />
                  )}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        <Box
          display="flex"
          justifyContent={inEditMode ? 'space-between' : 'end'}
          m={2}
        >
          {inEditMode && (
            <Button onClick={onAddOption} startIcon={<Add />}>
              <Msg id="misc.surveys.blocks.choiceQuestion.addOption" />
            </Button>
          )}
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

export default ChoiceQuestionBlock;
