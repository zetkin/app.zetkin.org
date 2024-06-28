import AbcIcon from '@mui/icons-material/Abc';
import SortIcon from '@mui/icons-material/Sort';
import { BaseSyntheticEvent, FC, useState } from 'react';
import {
  Box,
  ClickAwayListener,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

import DeleteHideButtons from '../DeleteHideButtons';
import PreviewableSurveyInput from '../elements/PreviewableSurveyInput';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import useSurveyMutations from 'features/surveys/hooks/useSurveyMutations';
import { ZetkinSurveyTextQuestionElement } from 'utils/types/zetkin';
import ZUIPreviewableInput from 'zui/ZUIPreviewableInput';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';

interface OpenQuestionBlockProps {
  editable: boolean;
  element: ZetkinSurveyTextQuestionElement;
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
  orgId: number;
  readOnly: boolean;
  surveyId: number;
}

enum FIELDTYPE {
  MULTILINE = 'multiLine',
  SINGLELINE = 'singleLine',
}

const OpenQuestionBlock: FC<OpenQuestionBlockProps> = ({
  editable,
  element,
  onEditModeEnter,
  onEditModeExit,
  orgId,
  readOnly,
  surveyId,
}) => {
  const elemQuestion = element.question;
  const messages = useMessages(messageIds);
  const { updateElement } = useSurveyMutations(orgId, surveyId);

  const [fieldType, setFieldType] = useState(
    elemQuestion.response_config.multiline === true
      ? FIELDTYPE.MULTILINE
      : FIELDTYPE.SINGLELINE
  );

  const [title, setTitle] = useState(elemQuestion.question);
  const [description, setDescription] = useState(elemQuestion.description);
  const [multiline, setMultiline] = useState(
    elemQuestion.response_config.multiline
  );

  const handleSelect = (event: BaseSyntheticEvent) => {
    setFieldType(event.target.value);
  };

  const { autoFocusDefault, clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter,
      onEditModeExit,
      readOnly,
      save: () => {
        updateElement(element.id, {
          question: {
            description: description,
            question: title,
            response_config: {
              multiline: multiline,
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
          label={messages.blocks.open.label()}
          onChange={(value) => setTitle(value)}
          placeholder={messages.blocks.open.empty()}
          value={title}
          variant="header"
        />
        <PreviewableSurveyInput
          {...previewableProps}
          label={messages.blocks.open.description()}
          onChange={(value) => setDescription(value)}
          placeholder=""
          value={description}
          variant="content"
        />
        <ZUIPreviewableInput
          {...previewableProps}
          renderInput={() => (
            <TextField
              defaultValue={
                elemQuestion.response_config.multiline === true
                  ? FIELDTYPE.MULTILINE
                  : FIELDTYPE.SINGLELINE
              }
              fullWidth
              label={messages.blocks.open.textFieldType()}
              margin="normal"
              onChange={(event) => {
                handleSelect(event),
                  setMultiline(
                    event.target.value === FIELDTYPE.MULTILINE ? true : false
                  );
              }}
              select
              SelectProps={{
                MenuProps: { disablePortal: true },
              }}
              sx={{ alignItems: 'center', display: 'flex' }}
              value={fieldType}
            >
              {Object.values(FIELDTYPE).map((value) => (
                <MenuItem key={value} value={value}>
                  {value === 'singleLine' ? (
                    <AbcIcon sx={{ marginRight: '10px' }} />
                  ) : (
                    <SortIcon sx={{ marginRight: '10px' }} />
                  )}
                  <Msg id={messageIds.blocks.open[value]} />
                </MenuItem>
              ))}
            </TextField>
          )}
          renderPreview={() => (
            <Typography variant="h5">
              {elemQuestion.response_config.multiline ? (
                <>
                  <SortIcon sx={{ marginRight: '10px' }} />
                  <Msg id={messageIds.blocks.open.multiLine} />{' '}
                  <Msg id={messageIds.blocks.open.fieldTypePreview} />
                </>
              ) : (
                <>
                  <AbcIcon sx={{ marginRight: '10px' }} />
                  <Msg id={messageIds.blocks.open.singleLine} />{' '}
                  <Msg id={messageIds.blocks.open.fieldTypePreview} />
                </>
              )}
            </Typography>
          )}
          value=""
        />
        <Box display="flex" justifyContent="end" m={2}>
          {!readOnly && (
            <DeleteHideButtons
              element={element}
              orgId={orgId}
              surveyId={surveyId}
            />
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default OpenQuestionBlock;
