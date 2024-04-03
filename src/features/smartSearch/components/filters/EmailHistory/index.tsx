import { MenuItem } from '@mui/material';
import { useState } from 'react';

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

export enum EMAIL_SELECT_SCOPE {
  ANY = 'any',
  FROM_PROJECT = 'fromProject',
  SPECIFIC_EMAIL = 'specificEmail',
}
export const MESSAGE_KEY_BY_OP = {
  not_opened: 'notOpened',
  not_sent: 'notSent',
  opened: 'opened',
  sent: 'sent',
} as const;

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
    //This is for extracting after and before
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
                    <Msg id={localMessageIds.emailScopeSelect[item]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            emailSelect:
              emailSelectScope === EMAIL_SELECT_SCOPE.SPECIFIC_EMAIL ? (
                <StyledSelect
                  minWidth="10rem"
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
                {Object.values(MESSAGE_KEY_BY_OP).map((operator) => (
                  <MenuItem key={operator} value={operator}>
                    <Msg id={localMessageIds.operatorSelect[operator]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            projectSelect:
              emailSelectScope === EMAIL_SELECT_SCOPE.FROM_PROJECT ? (
                <StyledSelect
                  minWidth="10rem"
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
