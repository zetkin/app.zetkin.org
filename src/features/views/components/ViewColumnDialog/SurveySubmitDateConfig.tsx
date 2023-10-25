import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import { COLUMN_TYPE, SelectedViewColumn } from '../types';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/views/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useSurveys from 'features/smartSearch/hooks/useSurveys';

interface SurveySubmitDateConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const SurveySubmitDateConfig = ({
  onOutputConfigured,
}: SurveySubmitDateConfigProps) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const surveys = useSurveys(orgId);

  return !surveys || surveys.length > 0 ? (
    <FormControl sx={{ width: 300 }}>
      <InputLabel>
        {messages.columnDialog.editor.fieldLabels.survey()}
      </InputLabel>
      <Select
        onChange={(evt) => {
          if (!evt.target.value) {
            return;
          }
          const surveyId = evt.target.value as number;
          onOutputConfigured([
            {
              config: {
                survey_id: surveyId,
              },
              title:
                surveys?.find((survey) => survey.id === surveyId)?.title || '',
              type: COLUMN_TYPE.SURVEY_SUBMITTED,
            },
          ]);
        }}
        variant="standard"
      >
        {surveys?.map((survey) => (
          <MenuItem key={survey.id} value={survey.id}>
            {survey.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <Typography>
      <Msg id={messageIds.columnDialog.choices.surveySubmitDate.noSurveys} />
    </Typography>
  );
};

export default SurveySubmitDateConfig;
