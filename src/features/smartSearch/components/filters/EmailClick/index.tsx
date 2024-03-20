import FilterForm from '../../FilterForm';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  EmailBlacklistFilterConfig,
  EmailClickFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { MenuItem } from '@mui/material';
const localMessageIds = messageIds.filters.emailClick;

interface EmailClickProps {
  filter:
    | SmartSearchFilterWithId<EmailClickFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<EmailClickFilterConfig>
      | ZetkinSmartSearchFilter<EmailClickFilterConfig>
  ) => void;
  onCancel: () => void;
}

const EmailClick = ({
  filter: initialFilter,
  onCancel,
  onSubmit,
}: EmailClickProps): JSX.Element => {
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<EmailBlacklistFilterConfig>(initialFilter, {
      reason: 'unsub_org',
    });

  return (
    <FilterForm
      onCancel={onCancel}
      onSubmit={(e) => console.log('hello')}
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
          }}
        />
      )}
    />
  );
};

export default EmailClick;
