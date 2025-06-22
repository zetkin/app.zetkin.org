import { Box, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { FC, useContext } from 'react';

import messageIds from 'features/surveys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useSurveyMutations from 'features/surveys/hooks/useSurveyMutations';
import { ELEMENT_TYPE, ZetkinSurveyElement } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

interface DeleteHideButtonsProps {
  element: ZetkinSurveyElement;
  orgId: number;
  surveyId: number;
}

const DeleteHideButtons: FC<DeleteHideButtonsProps> = ({
  element,
  orgId,
  surveyId,
}) => {
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { deleteElement, updateElement } = useSurveyMutations(orgId, surveyId);
  const messages = useMessages(messageIds);

  return (
    <Box display="flex">
      {element.type == ELEMENT_TYPE.QUESTION && (
        <FormControlLabel
          control={
            <Checkbox
              onChange={(ev) => {
                updateElement(element.id, {
                  question: {
                    required: !element.question.required,
                  },
                });
                ev.stopPropagation();
              }}
            />
          }
          label={`${messages.surveyForm.required()}`}
        />
      )}
      <IconButton
        onClick={(ev) => {
          updateElement(element.id, { hidden: !element.hidden });
          ev.stopPropagation();
        }}
      >
        {element.hidden ? <VisibilityOff /> : <Visibility />}
      </IconButton>
      <IconButton
        onClick={(ev) => {
          ev.stopPropagation();
          showConfirmDialog({
            onSubmit: () => deleteElement(element.id),
            title: messages.blocks.deleteBlockDialog.title(),
            warningText: messages.blocks.deleteBlockDialog.warningText(),
          });
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export default DeleteHideButtons;
