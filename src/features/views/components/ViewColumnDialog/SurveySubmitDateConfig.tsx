import { FormControl, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import { COLUMN_TYPE, SelectedViewColumn } from '../types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useSurveys from 'features/surveys/hooks/useSurveys';
import StyledAutocomplete from 'features/smartSearch/components/inputs/StyledAutocomplete';

interface SurveySubmitDateConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const SurveySubmitDateConfig = ({
  onOutputConfigured,
}: SurveySubmitDateConfigProps) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const surveys = useSurveys(orgId).data || [];
  const [surveyId, setSurveyId] = useState<number | undefined>();

  const onSurveyChange = (
    ev: SyntheticEvent & { target: { value: string } }
  ) => {
    if (!ev.target.value) {
      return;
    }
    const surveyId = +ev.target.value;
    setSurveyId(surveyId);
    onOutputConfigured([
      {
        config: {
          survey_id: surveyId,
        },
        title: surveys?.find((survey) => survey.id === surveyId)?.title || '',
        type: COLUMN_TYPE.SURVEY_SUBMITTED,
      },
    ]);
  };

  return !surveys || surveys.length > 0 ? (
    <FormControl sx={{ width: 300 }}>
      <StyledAutocomplete
        clearable={true}
        items={surveys.map((survey) => ({
          group: survey.campaign?.title,
          id: survey.id,
          label: survey.title,
        }))}
        label={messages.columnDialog.editor.fieldLabels.survey()}
        onChange={onSurveyChange}
        sx={{
          '& .MuiInputBase-input': {
            textOverflow: 'ellipsis',
          },
          '& .MuiInputBase-root .MuiInputBase-input': {
            fontSize: 'inherit',
          },
          '&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot':
            {
              paddingRight: '24px',
            },
          width: '100%',
        }}
        value={surveyId}
      />
    </FormControl>
  ) : (
    <Typography>
      <Msg id={messageIds.columnDialog.choices.surveySubmitDate.noSurveys} />
    </Typography>
  );
};

export default SurveySubmitDateConfig;
