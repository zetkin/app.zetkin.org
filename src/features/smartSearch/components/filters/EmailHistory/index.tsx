import { MenuItem } from '@mui/material';
import { useState } from 'react';

import convertToMessageKey from './convertToMessageKey';
import { EMAIL_SELECT_SCOPE } from '../EmailClick';
import FilterForm from '../../FilterForm';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useEmails from 'features/emails/hooks/useEmails';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  EmailHistoryFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

const localMessageIds = messageIds.filters.emailHistory;

enum EMAIL_HISTORY_OP {
  OPENED = 'opened',
  NOT_OPENED = 'not_opened',
  NOT_SENT = 'not_sent',
  SENT = 'sent',
}

interface EmailHistoryProps {
  filter:
    | SmartSearchFilterWithId<EmailHistoryFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<EmailHistoryFilterConfig>
      | ZetkinSmartSearchFilter<EmailHistoryFilterConfig>
  ) => void;
  onCancel: () => void;
}

const EmailHistory = ({
  filter: initialFilter,
  onCancel,
  onSubmit,
}: EmailHistoryProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const emailsFuture = useEmails(orgId).data || [];
  const projectsFuture = useCampaigns(orgId).data || [];

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<EmailHistoryFilterConfig>(initialFilter, {
      operator: 'sent',
    });
  const [emailSelectScope, setEmailSelectScope] = useState<EMAIL_SELECT_SCOPE>(
    filter.config.campaign
      ? EMAIL_SELECT_SCOPE.FROM_PROJECT
      : filter.config.email
      ? EMAIL_SELECT_SCOPE.SPECIFIC_EMAIL
      : EMAIL_SELECT_SCOPE.ANY
  );

  const setValueToKey = (
    key: keyof EmailHistoryFilterConfig,
    value: string | number
  ) => {
    setConfig({
      ...filter.config,
      [key]: value,
    });
  };
  const removeKey = (deleteKeys: (keyof EmailHistoryFilterConfig)[]) => {
    const copied = { ...filter.config };
    deleteKeys.forEach((key) => delete copied[key]);
    setConfig({
      ...copied,
    });
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    /* eslint-disable-next-line */
    const { after, before, ...rest } = filter.config;

    setConfig({
      ...rest,
      ...(range.after && { after: range.after }),
      ...(range.before && { before: range.before }),
    });
  };

  return (
    <FilterForm
      disableSubmit={
        (emailSelectScope === EMAIL_SELECT_SCOPE.FROM_PROJECT &&
          !filter.config.campaign) ||
        (emailSelectScope === EMAIL_SELECT_SCOPE.SPECIFIC_EMAIL &&
          !filter.config.email)
      }
      onCancel={onCancel}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(filter);
      }}
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
            emailScopeSelect: (
              <StyledSelect
                onChange={(e) => {
                  removeKey(['email', 'campaign']);
                  setEmailSelectScope(e.target.value as EMAIL_SELECT_SCOPE);
                }}
                value={emailSelectScope}
              >
                {Object.values(EMAIL_SELECT_SCOPE).map((item) => (
                  <MenuItem key={item} value={item}>
                    <Msg id={messageIds.filters.emailScopeSelect[item]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            emailSelect:
              emailSelectScope === EMAIL_SELECT_SCOPE.SPECIFIC_EMAIL ? (
                <StyledSelect
                  onChange={(e) =>
                    setValueToKey('email', parseInt(e.target.value))
                  }
                  value={filter.config.email || ''}
                >
                  {emailsFuture?.map((email) => (
                    <MenuItem key={`email-${email.id}`} value={email.id}>
                      {`"${email.title}"`}
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : null,
            operatorSelect: (
              <StyledSelect
                onChange={(e) => setValueToKey('operator', e.target.value)}
                value={filter.config.operator}
              >
                {Object.values(EMAIL_HISTORY_OP).map((status) => (
                  <MenuItem key={status} value={status}>
                    <Msg
                      id={
                        localMessageIds.operatorSelect[
                          convertToMessageKey(status) as
                            | 'notSent'
                            | 'opened'
                            | 'sent'
                            | 'notOpened'
                        ]
                      }
                    />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            projectSelect:
              emailSelectScope === EMAIL_SELECT_SCOPE.FROM_PROJECT ? (
                <StyledSelect
                  onChange={(e) =>
                    setValueToKey('campaign', parseInt(e.target.value))
                  }
                  value={filter.config.campaign || ''}
                >
                  {projectsFuture?.map((project) => (
                    <MenuItem key={`proejct-${project.id}`} value={project.id}>
                      {`"${project.title}"`}
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : null,
            timeFrame: (
              <TimeFrame
                filterConfig={{
                  after: filter.config.after,
                  before: filter.config.before,
                }}
                onChange={handleTimeFrameChange}
              />
            ),
          }}
        />
      )}
    />
  );
};

export default EmailHistory;
