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
import { FC, useEffect, useRef, useState } from 'react';

import DeleteHideButtons from '../DeleteHideButtons';
import DropdownIcon from 'zui/icons/DropDown';
import messageIds from 'features/surveys/l10n/messageIds';
import PreviewableSurveyInput from '../elements/PreviewableSurveyInput';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import useEditPreviewBlock from './useEditPreviewBlock';
import { ZetkinSurveyOptionsQuestionElement } from 'utils/types/zetkin';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';
import ZUIReorderable from 'zui/ZUIReorderable';
import { Msg, useMessages } from 'core/i18n';

interface ChoiceQuestionBlockProps {
  editable: boolean;
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
  editable,
  element,
  model,
  onEditModeEnter,
  onEditModeExit,
}) => {
  const elemQuestion = element.question;
  const messages = useMessages(messageIds);
  const lengthRef = useRef<number | undefined>(elemQuestion.options?.length);
  const [addedOptionId, setAddedOptionId] = useState(0);
  const [title, setTitle] = useState(elemQuestion.question);
  const [description, setDescription] = useState(elemQuestion.description);
  const [options, setOptions] = useState(elemQuestion.options || []);
  const [widgetType, setWidgetType] = useState<WidgetTypeValue>(
    elemQuestion.response_config.widget_type
  );

  useEffect(() => {
    setTitle(elemQuestion.question);
    setDescription(elemQuestion.description);
    setOptions(elemQuestion.options || []);
  }, [elemQuestion]);

  useEffect(() => {
    const options = elemQuestion.options;
    if (options) {
      // If the previous length is null, it's because it only now loaded for the
      // first time and the length has not really been read before.
      if (
        lengthRef.current !== undefined &&
        lengthRef.current < options.length
      ) {
        const lastOption = options[options.length - 1];
        setAddedOptionId(lastOption.id);
      }

      lengthRef.current = options.length;
    }
  }, [elemQuestion.options?.length]);

  const { autoFocusDefault, clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter,
      onEditModeExit,
      save: () => {
        model.updateOptionsQuestion(element.id, {
          question: {
            description: description,
            question: title,
            response_config: {
              widget_type: widgetType,
            },
          },
        });
      },
    });

  return (
    <ClickAwayListener {...clickAwayProps}>
      <Box {...containerProps}>
        <PreviewableSurveyInput
          {...previewableProps}
          focusInitially={autoFocusDefault}
          label={messages.blocks.choice.question()}
          onChange={(value) => setTitle(value)}
          placeholder={messages.blocks.choice.emptyQuestion()}
          value={title}
          variant="header"
        />
        <PreviewableSurveyInput
          {...previewableProps}
          label={messages.blocks.choice.description()}
          onChange={(value) => setDescription(value)}
          placeholder={messages.blocks.choice.emptyDescription()}
          value={description}
          variant="content"
        />
        {editable && (
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
        <ZUIReorderable
          centerWidgets
          disableClick
          disableDrag={!editable}
          items={options.map((option) => ({
            id: option.id,
            renderContent: () => (
              <ZUIPreviewableInput
                {...previewableProps}
                key={option.id}
                renderInput={(props) => (
                  <Box
                    key={option.id}
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    paddingY={1}
                    width="100%"
                  >
                    <Box paddingTop={0.8} paddingX={2}>
                      {widgetTypes[widgetType].previewIcon}
                    </Box>
                    <TextField
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus={addedOptionId == option.id}
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
                    <Box paddingX={2}>
                      {widgetTypes[widgetType].previewIcon}
                    </Box>
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
            ),
          }))}
          onReorder={(ids) => {
            model.updateOptionOrder(element.id, ids);
          }}
        />
        <Box
          display="flex"
          justifyContent={editable ? 'space-between' : 'end'}
          m={2}
        >
          {editable && (
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
          <DeleteHideButtons element={element} model={model} />
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default ChoiceQuestionBlock;
