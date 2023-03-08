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
import { FC, useEffect, useState } from 'react';

import DropdownIcon from 'zui/icons/DropDown';
import messageIds from 'features/surveys/l10n/messageIds';
import PreviewableSurveyInput from '../elements/PreviewableSurveyInput';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import { ZetkinSurveyOptionsQuestionElement } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';
import ZUIPreviewableInput, {
  ZUIPreviewableMode,
} from 'zui/ZUIPreviewableInput';

interface ChoiceQuestionBlockProps {
  element: ZetkinSurveyOptionsQuestionElement;
  model: SurveyDataModel;
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
}

const widgetTypes = {
  checkbox: {
    icon: <CheckBoxOutlined />,
    previewIcon: <CheckBoxOutlined color="secondary" />,
  },
  radio: {
    icon: <RadioButtonChecked />,
    previewIcon: <RadioButtonUnchecked color="secondary" />,
  },
  select: {
    icon: <DropdownIcon />,
    previewIcon: <DropdownIcon />,
  },
} as const;

type WidgetTypeValue = keyof typeof widgetTypes;

const ChoiceQuestionBlock: FC<ChoiceQuestionBlockProps> = ({
  element,
  model,
  onEditModeEnter,
  onEditModeExit,
}) => {
  const elemQuestion = element.question;
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState(elemQuestion.question);
  const [description, setDescription] = useState(elemQuestion.description);
  const [options, setOptions] = useState(elemQuestion.options || []);
  const [widgetType, setWidgetType] = useState<WidgetTypeValue>(
    elemQuestion.response_config.widget_type
  );
  const [mode, setMode] = useState<ZUIPreviewableMode>(
    ZUIPreviewableMode.PREVIEW
  );

  useEffect(() => {
    setTitle(elemQuestion.question);
    setDescription(elemQuestion.description);
    setOptions(elemQuestion.options || []);
  }, [elemQuestion]);

  const editing = mode == ZUIPreviewableMode.EDITABLE;

  const handleSwitchMode = (newMode: ZUIPreviewableMode) => {
    setMode(newMode);
    if (newMode == ZUIPreviewableMode.EDITABLE) {
      onEditModeEnter();
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (mode == ZUIPreviewableMode.EDITABLE) {
          setMode(ZUIPreviewableMode.PREVIEW);
          onEditModeExit();

          model.updateOptionsQuestion(element.id, {
            question: {
              description: description,
              question: title,
              response_config: {
                widget_type: widgetType,
              },
            },
          });
        }
      }}
    >
      <Box>
        <PreviewableSurveyInput
          label={messages.blocks.choice.question()}
          mode={mode}
          onChange={(value) => setTitle(value)}
          onSwitchMode={handleSwitchMode}
          placeholder={messages.blocks.choice.emptyQuestion()}
          value={title}
          variant="h4"
        />
        <PreviewableSurveyInput
          label={messages.blocks.choice.description()}
          mode={mode}
          onChange={(value) => setDescription(value)}
          onSwitchMode={handleSwitchMode}
          placeholder={messages.blocks.choice.emptyDescription()}
          value={description}
          variant="h5"
        />
        {editing && (
          <TextField
            fullWidth
            label={messages.blocks.choice.widget()}
            margin="normal"
            onChange={(ev) => {
              setWidgetType(ev.target.value as WidgetTypeValue);
            }}
            select
            SelectProps={{
              MenuProps: { disablePortal: true },
            }}
            sx={{ alignItems: 'center', display: 'flex' }}
            value={widgetType}
          >
            {Object.entries(widgetTypes).map(([value, type]) => (
              <MenuItem key={value} value={value}>
                <Box alignItems="center" display="flex">
                  <ListItemIcon>{type.icon}</ListItemIcon>
                  <Msg
                    id={
                      messageIds.blocks.choice.widgets[value as WidgetTypeValue]
                    }
                  />
                </Box>
              </MenuItem>
            ))}
          </TextField>
        )}
        {options.map((option) => (
          <ZUIPreviewableInput
            key={option.id}
            mode={mode}
            onSwitchMode={handleSwitchMode}
            renderInput={(props) => (
              <Box
                key={option.id}
                alignItems="center"
                display="flex"
                justifyContent="center"
                paddingTop={2}
                width="100%"
              >
                <Box paddingX={2}>{widgetTypes[widgetType].previewIcon}</Box>
                <TextField
                  fullWidth
                  inputProps={props}
                  onBlur={(ev) => {
                    model.updateElementOption(
                      element.id,
                      option.id,
                      ev.target.value
                    );
                  }}
                  onChange={(ev) => {
                    setOptions(
                      options.map((oldOpt) =>
                        oldOpt.id == option.id
                          ? { ...oldOpt, text: ev.target.value }
                          : oldOpt
                      )
                    );
                  }}
                  value={option.text}
                />
                <IconButton
                  onClick={() => {
                    model.deleteElementOption(element.id, option.id);
                  }}
                  sx={{ paddingX: 2 }}
                >
                  <Close />
                </IconButton>
              </Box>
            )}
            renderPreview={() => (
              <Box key={option.id} display="flex" paddingTop={2}>
                <Box paddingX={2}>{widgetTypes[widgetType].previewIcon}</Box>
                <Typography
                  color={option.text ? 'inherit' : 'secondary'}
                  fontStyle={option.text ? 'inherit' : 'italic'}
                >
                  {option.text || messages.blocks.choice.emptyOption()}
                </Typography>
              </Box>
            )}
            value={option.text}
          />
        ))}
        <Box
          display="flex"
          justifyContent={editing ? 'space-between' : 'end'}
          m={2}
        >
          {editing && (
            <Button
              onClick={(ev) => {
                model.addElementOption(element.id);
                ev.stopPropagation();
              }}
              startIcon={<Add />}
            >
              <Msg id={messageIds.blocks.choice.addOption} />
            </Button>
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default ChoiceQuestionBlock;
