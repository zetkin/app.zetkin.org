import { Autocomplete, FormControl, MenuItem, TextField } from '@mui/material';
import { ChangeEventHandler, useState } from 'react';

import { useMessages } from 'core/i18n';
import { COLUMN_TYPE, SelectedViewColumn } from '../types';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyQuestionElement,
} from 'utils/types/zetkin';
import messageIds from 'features/views/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';
import useSurveys from 'features/surveys/hooks/useSurveys';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';

interface SurveyResponsePluralConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const SurveyResponsesConfig = ({
  onOutputConfigured,
}: SurveyResponsePluralConfigProps) => {
  const { orgId } = useNumericRouteParams();
  const surveys = useSurveys(orgId);
  const messages = useMessages(messageIds);
  const [surveyId, setSurveyId] = useState<number | null>();
  const selectedSurvey = useSurveyElements(orgId, surveyId ?? null);
  const [selectedQuestions, setSelectedQuestions] = useState<
    ZetkinSurveyQuestionElement[]
  >([]);

  const onSurveyChange: ChangeEventHandler<{ value: unknown }> = (ev) => {
    setSurveyId(ev.target.value as number);
    setSelectedQuestions([]);
  };

  const makeColumns = (elements: ZetkinSurveyQuestionElement[]) => {
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
    <ZUIFuture future={surveys}>
      {(data) => {
        return (
          <FormControl sx={{ width: 300 }}>
            <TextField
              fullWidth
              label={messages.columnDialog.choices.surveyResponses.surveyField()}
              margin="normal"
              onChange={onSurveyChange}
              select
              value={surveyId || ''}
              variant="standard"
            >
              {data.map((survey) => (
                <MenuItem key={survey.id} value={survey.id}>
                  {survey.title}
                </MenuItem>
              ))}
            </TextField>
            {surveyId ? (
              <ZUIFuture future={selectedSurvey}>
                {(data) => {
                  const questionFromSurvey: ZetkinSurveyQuestionElement[] =
                    data.filter(
                      (elem) => elem.type == ELEMENT_TYPE.QUESTION
                    ) as ZetkinSurveyQuestionElement[];

                  return (
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
                          label={messages.columnDialog.choices.surveyResponses.questionField()}
                          slotProps={{
                            htmlInput: {
                              ...params.inputProps,
                            },
                          }}
                          variant="standard"
                        />
                      )}
                      value={selectedQuestions}
                    />
                  );
                }}
              </ZUIFuture>
            ) : (
              ''
            )}
          </FormControl>
        );
      }}
    </ZUIFuture>
  );
};
//};

export default SurveyResponsesConfig;
