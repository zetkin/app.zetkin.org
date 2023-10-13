import { Box, IconButton } from '@mui/material';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import { FC, useContext } from 'react';

import messageIds from 'features/surveys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useSurveyMutations from 'features/surveys/hooks/useSurveyMutations';
import { ZetkinSurveyElement } from 'utils/types/zetkin';
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
      <IconButton
        onClick={(ev) => {
          updateElement(element.id, { hidden: !element.hidden });
          ev.stopPropagation();
        }}
      >
        <RemoveRedEye />
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
