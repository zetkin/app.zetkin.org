import { MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

import FilterForm from '../../FilterForm';
import getSurveys from '../../../fetching/getSurveys';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  SurveySubmissionFilterConfig,
  TIME_FRAME,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.surveySubmission;

const DEFAULT_VALUE = 'none';

interface SurveySubmissionProps {
  filter:
    | SmartSearchFilterWithId<SurveySubmissionFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<SurveySubmissionFilterConfig>
      | ZetkinSmartSearchFilter<SurveySubmissionFilterConfig>
  ) => void;
  onCancel: () => void;
}

const SurveySubmission = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: SurveySubmissionProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const surveysQuery = useQuery(
    ['surveys', orgId],
    getSurveys(orgId as string)
  );
  const surveys = surveysQuery.data || [];

  const [submittable, setSubmittable] = useState(false);

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<SurveySubmissionFilterConfig>(initialFilter);

  useEffect(() => {
    if (surveys.length) {
      setConfig({
        operator: 'submitted',
        survey: filter.config.survey || surveys[0].id,
      });
      setSubmittable(true);
    }
  }, [surveys]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    const { operator, survey } = filter.config;
    setConfig({
      operator,
      survey,
      ...range,
    });
  };

  const handleSurveySelectChange = (surveyValue: string) => {
    if (surveyValue === DEFAULT_VALUE) {
      setSubmittable(false);
    } else {
      setConfig({ ...filter.config, survey: +surveyValue });
      setSubmittable(true);
    }
  };

  return (
    <FilterForm
      disableSubmit={!submittable}
      onCancel={onCancel}
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
                  <Msg id={localMessageIds.addRemoveSelect.add} />
                </MenuItem>
                <MenuItem key={OPERATION.SUB} value={OPERATION.SUB}>
                  <Msg id={localMessageIds.addRemoveSelect.sub} />
                </MenuItem>
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
                          surveyTitle:
                            surveys.find((s) => s.id === value)?.title ?? '',
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
                {surveys.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.title}
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            timeFrame: (
              <TimeFrame
                filterConfig={{
                  after: filter.config.after,
                  before: filter.config.before,
                }}
                onChange={handleTimeFrameChange}
                options={[
                  TIME_FRAME.EVER,
                  TIME_FRAME.AFTER_DATE,
                  TIME_FRAME.BEFORE_DATE,
                  TIME_FRAME.BETWEEN,
                  TIME_FRAME.BEFORE_TODAY,
                  TIME_FRAME.LAST_FEW_DAYS,
                ]}
              />
            ),
          }}
        />
      )}
    />
  );
};

export default SurveySubmission;
