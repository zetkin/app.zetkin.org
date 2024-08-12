import { FormEvent } from 'react';
import { MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  EmailBlacklistFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.emailBlacklist;

enum EMAIL_UNSUB_REASON {
  UNSUB_ORG = 'unsub_org',
  ANY = 'any',
}

interface EmailBlockedProps {
  filter:
    | SmartSearchFilterWithId<EmailBlacklistFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<EmailBlacklistFilterConfig>
      | ZetkinSmartSearchFilter<EmailBlacklistFilterConfig>
  ) => void;
  onCancel: () => void;
}

const EmailBlacklist = ({
  filter: initialFilter,
  onCancel,
  onSubmit,
}: EmailBlockedProps): JSX.Element => {
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<EmailBlacklistFilterConfig>(initialFilter, {
      operator: 'blacklisted',
      reason: 'unsub_org',
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  return (
    <FilterForm
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setConfig({ ...filter.config, organizations: orgs });
      }}
      onSubmit={(e) => handleSubmit(e)}
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
            reasonSelect: (
              <StyledSelect
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    reason: e.target.value as EMAIL_UNSUB_REASON,
                  })
                }
                value={filter.config.reason || EMAIL_UNSUB_REASON.ANY}
              >
                <MenuItem value={EMAIL_UNSUB_REASON.UNSUB_ORG}>
                  <Msg id={localMessageIds.reasonSelect.unsubOrg} />
                </MenuItem>

                <MenuItem value={EMAIL_UNSUB_REASON.ANY}>
                  <Msg id={localMessageIds.reasonSelect.any} />
                </MenuItem>
              </StyledSelect>
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default EmailBlacklist;
