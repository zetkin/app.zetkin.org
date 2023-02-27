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
  SvgIcon,
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

const enum POLL_TYPE {
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
}

type WidgetType = {
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
    icon: (
      <SvgIcon>
        <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
          <path
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
            fill="black"
            fillOpacity="0.54"
          />
          <path d="M7 9.5L12 14.5L17 9.5H7Z" fill="black" fillOpacity="0.54" />
        </svg>
      </SvgIcon>
    ),
    previewIcon: (
      <SvgIcon>
        <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
          <path
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
            fill="black"
            fillOpacity="0.54"
          />
          <path d="M7 9.5L12 14.5L17 9.5H7Z" fill="black" fillOpacity="0.54" />
        </svg>
      </SvgIcon>
    ),
    value: POLL_TYPE.SELECT,
  },
};

interface OptionProps {
  id: number;
  onDeleteOption: (optionId: number) => void;
  widgetType: WidgetType;
}

const Option = ({ id, onDeleteOption, widgetType }: OptionProps) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      paddingTop={2}
      width="100%"
    >
      <Box paddingX={2}>{widgetType.previewIcon}</Box>
      <TextField fullWidth label="Option" sx={{ paddingLeft: 1 }} />
      <IconButton onClick={() => onDeleteOption(id)} sx={{ paddingX: 2 }}>
        <Close />
      </IconButton>
    </Box>
  );
};

interface ChoiceQuestionBlockProps {
  hidden: boolean;
  inEditMode: boolean;
  onAddOption: () => void;
  onDelete: () => void;
  onDeleteOption: (optionId: number) => void;
  onEditModeEnter: () => void;
  onEditModeExit: (question: OptionsQuestionPatchBody) => void;
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
  question: questionElement,
}) => {
  const intl = useIntl();

  const [widgetType, setWidgetType] = useState<WidgetType>(widgetTypes.radio);
  const [question, setQuestion] = useState(questionElement.question);
  const [description, setDescription] = useState(questionElement.description);
  const [focus, setFocus] = useState<'description' | null>(null);

  const questionRef = useCallback((node: HTMLInputElement) => {
    node?.focus();
  }, []);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const widgetTypeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus === 'description') {
      const input = descriptionRef.current;
      input?.focus();
    }
  }, [focus]);

  const handleKeyDown = (evt: KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter') {
      onEditModeExit({ question: {} });
      setFocus(null);
    }
  };

  const options = questionElement.options || [];

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
              InputProps={{ inputRef: widgetTypeRef }}
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
              {options.map((option) => (
                <Option
                  key={option.id}
                  id={option.id}
                  onDeleteOption={(optionId: number) =>
                    onDeleteOption(optionId)
                  }
                  widgetType={widgetType}
                />
              ))}
            </Box>
          </Box>
        )}
        {!inEditMode && (
          <Box onClick={onEditModeEnter}>
            <Typography color={question ? 'inherit' : 'secondary'} variant="h4">
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
