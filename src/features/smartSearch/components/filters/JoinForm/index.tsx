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
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import StyledAutocomplete from '../../inputs/StyledAutocomplete';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import TimeFrame from '../TimeFrame';
import useJoinForms from 'features/joinForms/hooks/useJoinForms';
import { useNumericRouteParams } from 'core/hooks';

const DEFAULT_VALUE = 'any';

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
  const messages = useMessages(messageIds);
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
              <StyledAutocomplete
                items={[
                  {
                    group: 'pinned',
                    id: DEFAULT_VALUE,
                    label: messages.filters.joinForm.anyForm(),
                  },
                  ...forms.map((form) => ({
                    id: form.id,
                    label: form.title,
                  })),
                ]}
                onChange={(e) => {
                  const formId = +e.target.value;
                  const config = { ...filter.config };
                  if (e.target.value) {
                    config.form = formId;
                  } else {
                    delete config.form;
                  }
                  setConfig(config);
                }}
                value={filter.config.form || DEFAULT_VALUE}
              />
            ),
            timeFrame: (
              <TimeFrame
                filterConfig={filter.config.submitted || {}}
                onChange={(range) =>
                  setConfig({ ...filter.config, submitted: range })
                }
                options={[
                  TIME_FRAME.AFTER_DATE,
                  TIME_FRAME.ON_DATE,
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
