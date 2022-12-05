import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { ChangeEventHandler, FunctionComponent } from 'react';
import { MenuItem, TextField } from '@mui/material';

import getSurveys from 'features/smartSearch/fetching/getSurveys';
import { SurveySubmittedViewColumn } from 'features/views/components/types';
import ZUIQuery from 'zui/ZUIQuery';

interface SurveySubmittedColumnConfigFormProps {
  column: SurveySubmittedViewColumn;
  onChange: (config: SurveySubmittedViewColumn) => void;
}

const SurveySubmittedColumnConfigForm: FunctionComponent<
  SurveySubmittedColumnConfigFormProps
> = ({ column, onChange }) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;

  return (
    <ZUIQuery
      queries={{
        surveysQuery: useQuery(['surveys', orgId], getSurveys(orgId as string)),
      }}
    >
      {({ queries: { surveysQuery } }) => {
        const onSurveyChange: ChangeEventHandler<{ value: unknown }> = (ev) => {
          onChange({
            ...column,
            config: {
              survey_id: ev.target.value as number,
            },
            title:
              surveysQuery.data.find((survey) => survey.id === ev.target.value)
                ?.title || '',
          });
        };

        return (
          <TextField
            variant="standard"
            fullWidth
            label={intl.formatMessage({
              id: 'misc.views.columnDialog.editor.fieldLabels.survey',
            })}
            margin="normal"
            onChange={onSurveyChange}
            select
            value={column.config?.survey_id || ''}
          >
            {surveysQuery.data.map((survey) => (
              <MenuItem key={survey.id} value={survey.id}>
                {survey.title}
              </MenuItem>
            ))}
          </TextField>
        );
      }}
    </ZUIQuery>
  );
};

export default SurveySubmittedColumnConfigForm;
