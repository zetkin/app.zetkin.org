import { Autocomplete, FormControl, TextField } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

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
import StyledAutocomplete from 'features/smartSearch/components/inputs/StyledAutocomplete';

interface SurveyResponsePluralConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const SurveyResponsesConfig = ({
  onOutputConfigured,
}: SurveyResponsePluralConfigProps) => {
  const { orgId } = useNumericRouteParams();
  const surveysFuture = useSurveys(orgId);
  const messages = useMessages(messageIds);
  const [surveyId, setSurveyId] = useState<number | undefined>();
  const selectedSurvey = useSurveyElements(orgId, surveyId ?? null);
  const [selectedQuestions, setSelectedQuestions] = useState<
    ZetkinSurveyQuestionElement[]
  >([]);

  const onSurveyChange = (
    ev: SyntheticEvent & { target: { value: string } }
  ) => {
    setSurveyId(+ev.target.value);
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
    <ZUIFuture future={surveysFuture}>
      {(surveys) => {
        return (
          <FormControl sx={{ width: 300 }}>
            <StyledAutocomplete
              clearable={true}
              items={surveys.map((survey) => ({
                group: survey.campaign?.title,
                id: survey.id,
                label: survey.title,
              }))}
              label={messages.columnDialog.choices.surveyResponses.surveyField()}
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
            {surveyId ? (
              <ZUIFuture future={selectedSurvey}>
                {(data) => {
                  const questionFromSurvey: ZetkinSurveyQuestionElement[] =
                    data.filter((elem) => elem.type === ELEMENT_TYPE.QUESTION);

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
