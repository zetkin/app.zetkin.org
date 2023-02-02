import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import ZUIQuery from 'zui/ZUIQuery';
import { Autocomplete, FormControl, MenuItem, TextField } from '@mui/material';
import { ChangeEventHandler, useState } from 'react';

import getSurveysWithElements from 'features/smartSearch/fetching/getSurveysWithElements';
import { COLUMN_TYPE, SelectedViewColumn } from '../types';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyElement,
} from 'utils/types/zetkin';

interface SurveyResponsePluralConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const SurveyResponsesConfig = ({
  onOutputConfigured,
}: SurveyResponsePluralConfigProps) => {
  const { orgId } = useRouter().query;
  const surveysQuery = useQuery(
    ['surveysWithElements', orgId],
    getSurveysWithElements(orgId as string)
  );
  const intl = useIntl();
  const [surveyId, setSurveyId] = useState<number | null>();
  const [selectedQuestions, setSelectedQuestions] = useState<
    ZetkinSurveyElement[]
  >([]);

  const onSurveyChange: ChangeEventHandler<{ value: unknown }> = (ev) => {
    setSurveyId(ev.target.value as number);
    setSelectedQuestions([]);
  };

  const makeColumns = (elements: ZetkinSurveyElement[]) => {
    return elements.map((question) => ({
      config: { question_id: question.id },
      title: question.question.question,
      type:
        question.question.response_type === RESPONSE_TYPE.TEXT
          ? COLUMN_TYPE.SURVEY_RESPONSE
          : COLUMN_TYPE.SURVEY_OPTIONS,
    }));
  };

  return (
    <ZUIQuery queries={{ surveysQuery }}>
      {({ queries: { surveysQuery: successSurveysQuery } }) => {
        const selectedSurvey = successSurveysQuery.data.find(
          (survey) => survey.id == surveyId
        );
        const questionFromSurvey = selectedSurvey?.elements.filter(
          (elem) => elem.type == ELEMENT_TYPE.QUESTION
        );

        return (
          <FormControl sx={{ width: 300 }}>
            <TextField
              fullWidth
              label={intl.formatMessage({
                id: 'misc.views.columnDialog.choices.surveyResponses.surveyField',
              })}
              margin="normal"
              onChange={onSurveyChange}
              select
              value={surveyId || ''}
              variant="standard"
            >
              {successSurveysQuery.data.map((survey) => (
                <MenuItem key={survey.id} value={survey.id}>
                  {survey.title}
                </MenuItem>
              ))}
            </TextField>
            {surveyId ? (
              <Autocomplete
                disabled={!surveyId}
                fullWidth
                getOptionLabel={(option) => option.question.question}
                multiple
                onChange={(evt, value) => {
                  setSelectedQuestions(value);
                  const columns = makeColumns(value);
                  onOutputConfigured(columns);
                }}
                options={questionFromSurvey || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                    }}
                    label={intl.formatMessage({
                      id: 'misc.views.columnDialog.choices.surveyResponses.questionField',
                    })}
                    variant="standard"
                  ></TextField>
                )}
                value={selectedQuestions}
              />
            ) : (
              ''
            )}
          </FormControl>
        );
      }}
    </ZUIQuery>
  );
};
//};

export default SurveyResponsesConfig;
