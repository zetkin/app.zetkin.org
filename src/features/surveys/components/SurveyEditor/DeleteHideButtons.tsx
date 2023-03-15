import { Box, IconButton } from '@mui/material';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import { FC, useContext } from 'react';

import messageIds from 'features/surveys/l10n/messageIds';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import { useMessages } from 'core/i18n';
import { ZetkinSurveyElement } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

interface DeleteHideButtonsProps {
  element: ZetkinSurveyElement;
  model: SurveyDataModel;
}

const DeleteHideButtons: FC<DeleteHideButtonsProps> = ({ element, model }) => {
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const messages = useMessages(messageIds);

  const onClickDelete = () => {
    model.deleteElement(element.id);
  };

  return (
    <Box display="flex">
      <IconButton
        onClick={(ev) => {
          model.updateElement(element.id, { hidden: !element.hidden });
          ev.stopPropagation();
        }}
      >
        <RemoveRedEye />
      </IconButton>
      <IconButton
        onClick={(ev) => {
          ev.stopPropagation();
          showConfirmDialog({
            onSubmit: onClickDelete,
            title: messages.blocks.deleteDialog.title(),
            warningText: messages.blocks.deleteDialog.warningText(),
          });
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export default DeleteHideButtons;
