import { FC } from 'react';
import { Box, IconButton } from '@mui/material';
import { Delete, RemoveRedEye } from '@mui/icons-material';

import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import { ZetkinSurveyElement } from 'utils/types/zetkin';

interface DeleteHideButtonsProps {
  element: ZetkinSurveyElement;
  model: SurveyDataModel;
}

const DeleteHideButtons: FC<DeleteHideButtonsProps> = ({ element, model }) => {
  return (
    <Box display="flex">
      <IconButton
        onClick={() => {
          model.updateElement(element.id, { hidden: !element.hidden });
        }}
      >
        <RemoveRedEye />
      </IconButton>
      <IconButton
        onClick={(ev) => {
          model.deleteElement(element.id);
          ev.stopPropagation();
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export default DeleteHideButtons;
