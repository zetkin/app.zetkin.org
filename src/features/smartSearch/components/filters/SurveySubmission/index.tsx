import { MenuItem } from '@mui/material';
import { FormEvent } from 'react';

import FilterForm from '../../FilterForm';
import StyledAutocomplete from '../../inputs/StyledAutocomplete';
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
import { useNumericRouteParams } from 'core/hooks';
import useSurveys from 'features/surveys/hooks/useSurveys';

const localMessageIds = messageIds.filters.surveySubmission;

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
  const { orgId } = useNumericRouteParams();
  const surveys = useSurveys(orgId).data || [];

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<SurveySubmissionFilterConfig>(initialFilter);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    setConfig({
      ...filter.config,
      after: range.after,
      before: range.before,
      operator: 'submitted',
    });
  };

  const handleSurveySelectChange = (surveyValue: string) => {
    setConfig({
      ...filter.config,
      operator: 'submitted',
      survey: +surveyValue,
    });
  };

  const submittable =
    !!filter.config.survey && filter.config.operator === 'submitted';

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
            surveySelect: (
              <StyledAutocomplete
                clearable={true}
                items={surveys.map((s) => ({
                  id: s.id,
                  label: s.title,
                }))}
                onChange={(e) => handleSurveySelectChange(e.target.value)}
                value={filter.config.survey}
              />
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
                  TIME_FRAME.ON_DATE,
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
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default SurveySubmission;
