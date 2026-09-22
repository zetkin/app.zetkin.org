import { Checkbox, FormControlLabel } from '@mui/material';
import { FC } from 'react';

import messageIds from 'features/surveys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useSurveyMutations from 'features/surveys/hooks/useSurveyMutations';
import { ZetkinSurveyQuestionElement } from 'utils/types/zetkin';

const RequiredCheckbox: FC<{
  orgId: number;
  surveyId: number;
  surveyQuestionElement: ZetkinSurveyQuestionElement;
}> = ({ surveyQuestionElement, orgId, surveyId }) => {
  const messages = useMessages(messageIds);
  const { updateElement } = useSurveyMutations(orgId, surveyId);

  return (
    <FormControlLabel
      control={
        <Checkbox
          defaultChecked={surveyQuestionElement.question.required}
          onChange={(ev) => {
            updateElement(surveyQuestionElement.id, {
              question: {
                required: !surveyQuestionElement.question.required,
              },
            });
            ev.stopPropagation();
          }}
        />
      }
      label={`${messages.surveyEditor.required()}`}
    />
  );
};

export default RequiredCheckbox;
