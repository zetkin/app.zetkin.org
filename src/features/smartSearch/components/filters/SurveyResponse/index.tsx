import { Box, MenuItem, Tooltip } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';

import FilterForm from '../../FilterForm';
import StyledSelect from '../../inputs/StyledSelect';
import StyledTextInput from '../../inputs/StyledTextInput';
import { truncateOnMiddle } from 'utils/stringUtils';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';
import {
  MATCH_OPERATORS,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  SurveyResponseBase,
  SurveyResponseFilterConfig,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
const localMessageIds = messageIds.filters.surveyResponse;

const DEFAULT_VALUE = 'none';

interface SurveyResponseProps {
  filter:
    | SmartSearchFilterWithId<SurveyResponseFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<SurveyResponseFilterConfig>
      | ZetkinSmartSearchFilter<SurveyResponseFilterConfig>
  ) => void;
  onCancel: () => void;
}

interface InternalConfig extends SurveyResponseBase {
  survey?: number;
  question?: number;
}

const SurveyResponse = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: SurveyResponseProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const surveys = useSurveysWithElements(orgId).data || [];

  const getSurveyIdfromQuestionId = (questionId?: number) => {
    return questionId
      ? surveys
          .map((s) => ({
            elements: s.elements.map((e) => e.id),
            id: s.id,
          }))
          .find((s) => s.elements.includes(questionId))?.id
      : undefined;
  };

  const { filter, setOp } =
    useSmartSearchFilter<SurveyResponseFilterConfig>(initialFilter);

  const questionId =
    'question' in filter.config ? filter.config.question : undefined;
  const surveyId =
    'survey' in filter.config
      ? filter.config.survey
      : getSurveyIdfromQuestionId(questionId);

  const [internalConfig, setInternalConfig] = useState<InternalConfig>({
    ...filter.config,
    question: questionId,
    survey: surveyId,
  });

  useEffect(() => {
    if (surveys.length) {
      setInternalConfig({
        operator: internalConfig.operator || MATCH_OPERATORS.IN,
        question: internalConfig.question,
        survey: internalConfig.survey || surveys[0].id,
        value: internalConfig.value || '',
      });
    }
  }, [surveys.length]);

  // check if there are questions with response type of 'text'
  const validQuestions: ZetkinSurveyTextQuestionElement[] =
    (surveys
      .find((s) => s.id === internalConfig.survey)
      ?.elements.filter(
        (e) =>
          e.type === ELEMENT_TYPE.QUESTION &&
          e.question.response_type === RESPONSE_TYPE.TEXT
      ) as ZetkinSurveyTextQuestionElement[]) || [];

  //submit if there is valid survey, valid questions and search field filled in
  const submittable =
    internalConfig.survey &&
    validQuestions.length &&
    internalConfig.value.length;

  //event handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (internalConfig.question) {
      onSubmit({
        ...filter,
        config: {
          operator: internalConfig.operator,
          question: internalConfig.question,
          value: internalConfig.value,
        },
      });
    } else if (internalConfig.survey) {
      onSubmit({
        ...filter,
        config: {
          ...internalConfig,
          survey: internalConfig.survey,
        },
      });
    }
  };

  const handleQuestionSelectChange = (questionValue: string) => {
    if (questionValue === DEFAULT_VALUE) {
      setInternalConfig({ ...internalConfig, question: undefined });
    } else {
      setInternalConfig({ ...internalConfig, question: +questionValue });
    }
  };

  const handleSurveySelectChange = (surveyValue: string) => {
    setInternalConfig({
      ...internalConfig,
      question: undefined,
      survey: +surveyValue,
    });
  };

  const handleMatchSelectChange = (matchValue: string) => {
    setInternalConfig({
      ...internalConfig,
      operator: matchValue as MATCH_OPERATORS,
    });
  };

  const handleValueChange = (value: string) => {
    setInternalConfig({ ...internalConfig, value: value });
  };

  return (
    <FilterForm
      disableSubmit={!submittable}
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setInternalConfig({ ...internalConfig, organizations: orgs });
      }}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => (
        <>
          <Msg id={localMessageIds.examples.one} />
          <br />
          <Msg id={localMessageIds.examples.two} />
        </>
      )}
      renderSentence={() => (
        <Msg
          id={localMessageIds.inputString}
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                <MenuItem key={OPERATION.ADD} value={OPERATION.ADD}>
                  <Msg id={messageIds.operators.add} />
                </MenuItem>
                <MenuItem key={OPERATION.SUB} value={OPERATION.SUB}>
                  <Msg id={messageIds.operators.sub} />
                </MenuItem>
                <MenuItem key={OPERATION.LIMIT} value={OPERATION.LIMIT}>
                  <Msg id={messageIds.operators.limit} />
                </MenuItem>
              </StyledSelect>
            ),
            freeTextInput: (
              <StyledTextInput
                inputString={internalConfig.value} // dynamic width
                onChange={(e) => handleValueChange(e.target.value)}
                value={internalConfig.value}
              />
            ),
            matchSelect: (
              <StyledSelect
                onChange={(e) => handleMatchSelectChange(e.target.value)}
                value={internalConfig.operator || MATCH_OPERATORS.IN}
              >
                {Object.values(MATCH_OPERATORS).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={localMessageIds.matchSelect[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            questionSelect: (
              <StyledSelect
                disabled={!surveys.length}
                onChange={(e) => handleQuestionSelectChange(e.target.value)}
                SelectProps={{
                  renderValue: function getLabel(value) {
                    return value === DEFAULT_VALUE ? (
                      <Msg id={localMessageIds.questionSelect.any} />
                    ) : (
                      <Msg
                        id={localMessageIds.questionSelect.question}
                        values={{
                          question: truncateOnMiddle(
                            validQuestions.find((q) => q.id === value)?.question
                              .question ?? '',
                            30
                          ),
                        }}
                      />
                    );
                  },
                }}
                value={internalConfig.question || DEFAULT_VALUE}
              >
                {!validQuestions.length && (
                  <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
                    <Msg id={localMessageIds.questionSelect.none} />
                  </MenuItem>
                )}
                {validQuestions.length && (
                  <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
                    <Msg id={localMessageIds.questionSelect.any} />
                  </MenuItem>
                )}
                {validQuestions.map((q) => (
                  <MenuItem key={q.id} value={q.id}>
                    <Tooltip
                      placement="right-start"
                      title={
                        q.question.question.length >= 40
                          ? q.question.question
                          : ''
                      }
                    >
                      <Box>{truncateOnMiddle(q.question.question, 40)}</Box>
                    </Tooltip>
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            surveySelect: (
              <StyledSelect
                onChange={(e) => handleSurveySelectChange(e.target.value)}
                SelectProps={{
                  renderValue: function getLabel(value) {
                    return value === DEFAULT_VALUE ? (
                      <Msg id={localMessageIds.surveySelect.any} />
                    ) : (
                      <Msg
                        id={localMessageIds.surveySelect.survey}
                        values={{
                          surveyTitle: truncateOnMiddle(
                            surveys.find((s) => s.id === value)?.title ?? '',
                            30
                          ),
                        }}
                      />
                    );
                  },
                }}
                value={internalConfig.survey || DEFAULT_VALUE}
              >
                {!surveys.length && (
                  <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
                    <Msg id={localMessageIds.surveySelect.none} />
                  </MenuItem>
                )}
                {surveys.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    <Tooltip
                      placement="right-start"
                      title={s.title.length >= 40 ? s.title : ''}
                    >
                      <Box>{truncateOnMiddle(s.title, 40)}</Box>
                    </Tooltip>
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
          }}
        />
      )}
      selectedOrgs={internalConfig.organizations}
    />
  );
};

export default SurveyResponse;
