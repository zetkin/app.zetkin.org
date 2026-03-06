import {
  Autocomplete,
  FormControl,
  ListSubheader,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEventHandler, useState } from 'react';

import { COLUMN_TYPE, SelectedViewColumn } from '../types';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyQuestionElement,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';
import useSurveys from 'features/surveys/hooks/useSurveys';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';

interface SurveyResponseConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

export enum SURVEY_QUESTION_OPTIONS {
  ALL_OPTIONS = 'allSingle',
  ALL_OPTIONS_SEPARATED = 'allOptionsSeparated',
}

const SurveyResponseConfig = ({
  onOutputConfigured,
}: SurveyResponseConfigProps) => {
  const { orgId } = useNumericRouteParams();
  const surveys = useSurveys(orgId);
  const messages = useMessages(messageIds);

  const [surveyId, setSurveyId] = useState<number | null>();
  const selectedSurvey = useSurveyElements(orgId, surveyId ?? null);
  const [selectedQuestion, setSelectedQuestion] =
    useState<ZetkinSurveyQuestionElement | null>(null);
  const [selectedColumnOption, setSelectedColumnOption] = useState<string>(
    SURVEY_QUESTION_OPTIONS.ALL_OPTIONS
  );

  const onSurveyChange: ChangeEventHandler<{ value: unknown }> = (ev) => {
    setSurveyId(ev.target.value as number);
    setSelectedQuestion(null);
    onOutputConfigured([]);
  };

  const makeTextColumn = (selectedElement: ZetkinSurveyTextQuestionElement) => {
    return [
      {
        config: {
          question_id: selectedElement.id,
        },
        title: selectedElement.question.question,
        type: COLUMN_TYPE.SURVEY_RESPONSE,
      },
    ];
  };

  return (
    <ZUIFuture future={surveys}>
      {(data) => {
        return (
          <FormControl sx={{ width: 300 }}>
            <TextField
              fullWidth
              label={messages.columnDialog.choices.surveyResponse.surveyField()}
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
            {!!surveyId && (
              <ZUIFuture future={selectedSurvey}>
                {(data) => {
                  const questionsFromSurvey: ZetkinSurveyQuestionElement[] =
                    (data.filter(
                      (elem) =>
                        elem.type == ELEMENT_TYPE.QUESTION &&
                        (elem.question.response_type == RESPONSE_TYPE.TEXT ||
                          elem.question.options?.length)
                    ) as ZetkinSurveyQuestionElement[]) ?? [];
                  return (
                    <Autocomplete
                      disabled={!surveyId}
                      fullWidth
                      getOptionLabel={(option) => option.question.question}
                      onChange={(evt, value) => {
                        if (value !== null) {
                          setSelectedQuestion(value);
                          if (
                            value.question.response_type === RESPONSE_TYPE.TEXT
                          ) {
                            const columns = makeTextColumn(
                              value as ZetkinSurveyTextQuestionElement
                            );
                            onOutputConfigured(columns);
                          } else if (
                            value.question.response_type ===
                            RESPONSE_TYPE.OPTIONS
                          ) {
                            setSelectedColumnOption(
                              SURVEY_QUESTION_OPTIONS.ALL_OPTIONS
                            );
                            const columns = makeOptionColumns(
                              value,
                              SURVEY_QUESTION_OPTIONS.ALL_OPTIONS,
                              surveyId
                            );
                            if (columns !== undefined) {
                              onOutputConfigured(columns);
                            }
                          }
                        }
                      }}
                      options={questionsFromSurvey || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={messages.columnDialog.choices.surveyResponse.questionField()}
                          slotProps={{
                            htmlInput: {
                              ...params.inputProps,
                            },
                          }}
                          variant="standard"
                        />
                      )}
                      value={selectedQuestion}
                    />
                  );
                }}
              </ZUIFuture>
            )}
            {selectedQuestion?.question.response_type ===
              RESPONSE_TYPE.TEXT && (
              <Typography sx={{ marginTop: 2 }}>
                <Msg
                  id={messageIds.columnDialog.choices.surveyResponse.textField}
                />
              </Typography>
            )}
            {selectedQuestion?.question.response_type ===
              RESPONSE_TYPE.OPTIONS && (
              <TextField
                label={messages.columnDialog.choices.surveyResponse.optionsLabel()}
                onChange={(evt) => {
                  if (surveyId) {
                    setSelectedColumnOption(evt.target.value);
                    const columns = makeOptionColumns(
                      selectedQuestion,
                      evt.target.value,
                      surveyId
                    );
                    if (columns !== undefined) {
                      onOutputConfigured(columns);
                    }
                  }
                }}
                select
                value={selectedColumnOption}
                variant="standard"
              >
                <ListSubheader>
                  <Msg
                    id={
                      messageIds.columnDialog.choices.surveyResponse
                        .allOptionsHeader
                    }
                  />
                </ListSubheader>
                <MenuItem value={SURVEY_QUESTION_OPTIONS.ALL_OPTIONS}>
                  <Msg
                    id={
                      messageIds.columnDialog.choices.surveyResponse.allOptions
                    }
                  />
                </MenuItem>
                <MenuItem value={SURVEY_QUESTION_OPTIONS.ALL_OPTIONS_SEPARATED}>
                  <Msg
                    id={
                      messageIds.columnDialog.choices.surveyResponse
                        .allOptionsSeparated
                    }
                  />
                </MenuItem>
                <ListSubheader>
                  <Msg
                    id={
                      messageIds.columnDialog.choices.surveyResponse.oneOption
                    }
                  />
                </ListSubheader>
                {selectedQuestion?.question.options?.map((option) => (
                  <MenuItem key={option.id} value={option.id.toString()}>
                    {option.text}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </FormControl>
        );
      }}
    </ZUIFuture>
  );
};

const makeOptionColumns = (
  selectedQuestion: ZetkinSurveyQuestionElement,
  selectedOption: string,
  surveyId: number
) => {
  if (
    selectedQuestion?.type != ELEMENT_TYPE.QUESTION ||
    selectedQuestion.question.response_type != RESPONSE_TYPE.OPTIONS
  ) {
    return [];
  }

  if (selectedQuestion !== undefined && selectedQuestion !== null) {
    if (selectedOption === SURVEY_QUESTION_OPTIONS.ALL_OPTIONS) {
      return [
        {
          config: {
            question_id: selectedQuestion.id,
          },

          title: selectedQuestion.question.question,
          type: COLUMN_TYPE.SURVEY_OPTIONS,
        },
      ];
    } else if (
      selectedOption === SURVEY_QUESTION_OPTIONS.ALL_OPTIONS_SEPARATED
    ) {
      return selectedQuestion.question.options?.map((option) => {
        return {
          config: {
            option_id: option.id,
            survey_id: surveyId,
          },
          title: option.text,
          type: COLUMN_TYPE.SURVEY_OPTION,
        };
      });
    } else {
      const optionSelected = selectedQuestion.question.options?.find(
        (option) => option.id === parseInt(selectedOption)
      );
      if (optionSelected === undefined) {
        return [];
      }
      return [
        {
          config: {
            option_id: optionSelected.id,
            survey_id: surveyId,
          },
          title: optionSelected.text,
          type: COLUMN_TYPE.SURVEY_OPTION,
        },
      ];
    }
  }
};

export default SurveyResponseConfig;
