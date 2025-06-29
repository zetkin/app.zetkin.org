import { DoneAll } from '@mui/icons-material';
import { Box, Chip, MenuItem, Tooltip } from '@mui/material';
import { FormEvent, useEffect } from 'react';

import FilterForm from '../../FilterForm';
import { Msg } from 'core/i18n';
import StyledItemSelect from '../../inputs/StyledItemSelect';
import StyledSelect from '../../inputs/StyledSelect';
import { truncateOnMiddle } from 'utils/stringUtils';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  SURVEY_CONDITION_OP,
  FilterConfigOrgOptions,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  SurveyOptionFilterConfig,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyOption,
  ZetkinSurveyQuestionElement,
} from 'utils/types/zetkin';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useSurveysWithElements from 'features/surveys/hooks/useSurveysWithElements';
const localMessageIds = messageIds.filters.surveyOption;

const DEFAULT_VALUE = 'none';

interface SurveyOptionProps {
  filter:
    | SmartSearchFilterWithId<SurveyOptionFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<SurveyOptionFilterConfig>
      | ZetkinSmartSearchFilter<SurveyOptionFilterConfig>
  ) => void;
  onCancel: () => void;
}

interface InternalConfig {
  survey?: number;
  question?: number;
  operator: SURVEY_CONDITION_OP;
  options: number[];
  organizations?: FilterConfigOrgOptions;
}

const SurveyOption = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: SurveyOptionProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const surveysWithElementsFuture = useSurveysWithElements(orgId);
  const surveys = surveysWithElementsFuture.data ?? [];
  const surveysSorted = surveys.sort((s1, s2) => {
    return s1.title.localeCompare(s2.title);
  });

  const { filter, setConfig, setOp } = useSmartSearchFilter<InternalConfig>(
    initialFilter,
    {
      operator: SURVEY_CONDITION_OP.ALL,
      options: [],
    }
  );

  useEffect(() => {
    if (surveys.length) {
      setConfig({
        ...filter.config,
        question:
          filter.config.question ||
          surveys[0].elements.find(
            (e) =>
              e.type === ELEMENT_TYPE.QUESTION &&
              e.question.response_type === RESPONSE_TYPE.OPTIONS
          )?.id,
        survey: filter.config.survey || surveys[0].id,
      });
    }
  }, [surveys.length]);

  // check if there are questions with response type of 'text'
  const validQuestions: ZetkinSurveyQuestionElement[] =
    (surveys
      .find((s) => s.id === filter.config.survey)
      ?.elements.filter(
        (e) =>
          e.type === ELEMENT_TYPE.QUESTION &&
          e.question.response_type === RESPONSE_TYPE.OPTIONS
      ) as ZetkinSurveyQuestionElement[]) || [];
  const validQuestionsSorted = validQuestions.sort((vq1, vq2) => {
    return vq1.question.question.localeCompare(vq2.question.question);
  });

  const selectedElement = surveys
    .find((s) => s.id === filter.config.survey)
    ?.elements.find((e) => e.id == filter.config.question);
  const validOptions =
    (selectedElement?.type == ELEMENT_TYPE.QUESTION &&
    selectedElement.question.response_type == RESPONSE_TYPE.OPTIONS
      ? selectedElement.question.options
      : []) || [];

  // convert filter.config.options to an array of Zetkin option objects keeping the correct order
  const selectedOptions = filter.config.options
    .map((option) => validOptions.find((o) => o?.id === option))
    .filter((o) => o) as ZetkinSurveyOption[];

  const styledValidOptions = validOptions.map((o) => ({
    id: o.id,
    title: o.text,
  }));
  const styledSelectedOptions = selectedOptions.map((o) => ({
    id: o.id,
    title: o.text,
  }));

  //submit if there is valid survey, valid questions and at least one option chosen
  const submittable =
    filter.config.survey &&
    filter.config.question &&
    filter.config.options.length;

  //event handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter as ZetkinSmartSearchFilter<SurveyOptionFilterConfig>);
  };

  const handleQuestionSelectChange = (questionValue: string) => {
    if (questionValue === DEFAULT_VALUE) {
      setConfig({
        ...filter.config,
        options: [],
        question: undefined,
      });
    } else {
      setConfig({
        ...filter.config,
        options: [],
        question: +questionValue,
      });
    }
  };

  const handleSurveySelectChange = (surveyValue: string) => {
    const newQuestion = surveys
      .find((s) => s.id === +surveyValue)
      ?.elements.find(
        (e) =>
          e.type === ELEMENT_TYPE.QUESTION &&
          e.question.response_type === RESPONSE_TYPE.OPTIONS
      );
    setConfig({
      ...filter.config,
      options: [],
      question: newQuestion?.id,
      survey: +surveyValue,
    });
  };

  const handleConditionSelectChange = (conditionValue: string) => {
    setConfig({
      ...filter.config,
      operator: conditionValue as SURVEY_CONDITION_OP,
    });
  };

  const handleOptionChange = (options: { id: number; title: string }[]) => {
    setConfig({ ...filter.config, options: options.map((t) => t.id) });
  };

  const handleOptionDelete = (option: ZetkinSurveyOption) => {
    setConfig({
      ...filter.config,
      options: filter.config.options.filter((o) => o !== option.id),
    });
  };

  return (
    <FilterForm
      disableSubmit={!submittable}
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setConfig({ ...filter.config, organizations: orgs });
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
                {Object.values(OPERATION).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={messageIds.operators[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            conditionSelect: (
              <StyledSelect
                onChange={(e) => handleConditionSelectChange(e.target.value)}
                value={filter.config.operator}
              >
                {Object.values(SURVEY_CONDITION_OP).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={localMessageIds.conditionSelect[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            options: (
              <Box
                alignItems="center"
                display="inline-flex"
                style={{ verticalAlign: 'middle' }}
              >
                {selectedOptions.map((option) => {
                  return (
                    <Tooltip key={option.id} title={option.text}>
                      <Chip
                        icon={<DoneAll />}
                        label={option.text}
                        onDelete={() => handleOptionDelete(option)}
                        style={{
                          margin: '3px',
                          maxWidth: '10rem',
                        }}
                        variant="outlined"
                      />
                    </Tooltip>
                  );
                })}
                {selectedOptions.length < validOptions.length && (
                  <StyledItemSelect
                    getOptionDisabled={(o) => styledSelectedOptions.includes(o)}
                    onChange={(_, v) => handleOptionChange(v)}
                    options={styledValidOptions}
                    value={styledValidOptions.filter((t) =>
                      filter.config.options?.includes(t.id)
                    )}
                  />
                )}
              </Box>
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
                            40
                          ),
                        }}
                      />
                    );
                  },
                }}
                value={filter.config.question || DEFAULT_VALUE}
              >
                {!validQuestions.length && (
                  <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
                    <Msg id={localMessageIds.questionSelect.none} />
                  </MenuItem>
                )}
                {validQuestionsSorted.map((q) => (
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
                            40
                          ),
                        }}
                      />
                    );
                  },
                }}
                value={filter.config.survey || DEFAULT_VALUE}
              >
                {!surveys.length && (
                  <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
                    <Msg id={localMessageIds.surveySelect.none} />
                  </MenuItem>
                )}
                {surveysSorted.map((s) => (
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
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default SurveyOption;
