import { useState } from 'react';
import { Box, MenuItem, Tooltip } from '@mui/material';

import FilterForm from '../../FilterForm';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import { truncateOnMiddle } from 'utils/stringUtils';
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

export const MESSAGE_KEY_BY_OP = {
  not_opened: 'notOpened',
  not_sent: 'notSent',
  opened: 'opened',
  sent: 'sent',
} as const;

type EmailSelectScopeType = 'any' | 'email' | 'project';

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
  const emails = useEmails(orgId).data || [];
  const emailsSorted = emails.sort((e1, e2) => {
    return e1.title!.localeCompare(e2.title!);
  });
  const projects = useCampaigns(orgId).data || [];
  const projectsSorted = projects.sort((p1, p2) => {
    return p1.title.localeCompare(p2.title);
  });

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<EmailHistoryFilterConfig>(initialFilter, {
      operator: 'sent',
    });
  const [emailSelectScope, setEmailSelectScope] =
    useState<EmailSelectScopeType>(
      filter.config.campaign ? 'project' : filter.config.email ? 'email' : 'any'
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
        (emailSelectScope === 'project' && !filter.config.campaign) ||
        (emailSelectScope === 'email' && !filter.config.email)
      }
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setConfig({ ...filter.config, organizations: orgs });
      }}
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
                  setEmailSelectScope(e.target.value as EmailSelectScopeType);
                }}
                value={emailSelectScope}
              >
                {Object.keys(localMessageIds.emailScopeSelect).map((item) => (
                  <MenuItem key={item} value={item}>
                    <Msg
                      id={
                        localMessageIds.emailScopeSelect[
                          item as EmailSelectScopeType
                        ]
                      }
                    />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            emailSelect:
              emailSelectScope === 'email' ? (
                <StyledSelect
                  minWidth="10rem"
                  onChange={(e) =>
                    setValueToKey('email', parseInt(e.target.value))
                  }
                  value={filter.config.email || ''}
                >
                  {emailsSorted.map((email) => (
                    <MenuItem key={`email-${email.id}`} value={email.id}>
                      <Tooltip
                        placement="right-start"
                        title={
                          !email.title || email.title.length < 40
                            ? ''
                            : email.title
                        }
                      >
                        <Box>{`"${truncateOnMiddle(
                          email.title ?? '',
                          40
                        )}"`}</Box>
                      </Tooltip>
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : null,
            operatorSelect: (
              <StyledSelect
                onChange={(e) => setValueToKey('operator', e.target.value)}
                value={filter.config.operator}
              >
                {Object.keys(MESSAGE_KEY_BY_OP).map((operator) => {
                  const opKey = operator as keyof typeof MESSAGE_KEY_BY_OP;
                  const messageKey = MESSAGE_KEY_BY_OP[opKey];

                  return (
                    <MenuItem key={operator} value={operator}>
                      <Msg id={localMessageIds.operatorSelect[messageKey]} />
                    </MenuItem>
                  );
                })}
              </StyledSelect>
            ),
            projectSelect:
              emailSelectScope === 'project' ? (
                <StyledSelect
                  minWidth="10rem"
                  onChange={(e) =>
                    setValueToKey('campaign', parseInt(e.target.value))
                  }
                  value={filter.config.campaign || ''}
                >
                  {projectsSorted.map((project) => (
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
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default EmailHistory;
