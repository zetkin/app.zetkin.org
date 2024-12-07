import { FC, FormEvent } from 'react';
import { MenuItem } from '@mui/material';

import {
  JoinFormFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  TIME_FRAME,
  ZetkinSmartSearchFilter,
} from '../../types';
import FilterForm from '../../FilterForm';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import TimeFrame from '../TimeFrame';
import useJoinForms from 'features/joinForms/hooks/useJoinForms';
import { useNumericRouteParams } from 'core/hooks';

type Props = {
  filter: SmartSearchFilterWithId<JoinFormFilterConfig> | NewSmartSearchFilter;
  onCancel: () => void;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<JoinFormFilterConfig>
      | ZetkinSmartSearchFilter<JoinFormFilterConfig>
  ) => void;
};

const localMessageIds = messageIds.filters.joinForm;

const JoinFormFilter: FC<Props> = ({
  filter: initialFilter,
  onSubmit,
  onCancel,
}) => {
  const { orgId } = useNumericRouteParams();
  const forms = useJoinForms(orgId).data || [];
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<JoinFormFilterConfig>(initialFilter, {});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  return (
    <FilterForm
      onCancel={onCancel}
      onSubmit={handleSubmit}
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
            formSelect: (
              <StyledSelect
                onChange={(e) => {
                  const formId = parseInt(e.target.value);
                  const config = { ...filter.config };
                  if (formId) {
                    config.form = formId;
                  } else {
                    delete config.form;
                  }

                  setConfig(config);
                }}
                value={filter.config.form || 'any'}
              >
                <MenuItem value="any">
                  <Msg id={localMessageIds.anyForm} />
                </MenuItem>
                {forms.map((form) => (
                  <MenuItem key={form.id} value={form.id}>
                    {form.title}
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            timeFrame: (
              <TimeFrame
                filterConfig={filter.config.submitted || {}}
                onChange={(range) =>
                  setConfig({ ...filter.config, submitted: range })
                }
                options={[
                  TIME_FRAME.AFTER_DATE,
                  TIME_FRAME.BEFORE_DATE,
                  TIME_FRAME.BEFORE_TODAY,
                  TIME_FRAME.BETWEEN,
                  TIME_FRAME.EVER,
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

export default JoinFormFilter;
