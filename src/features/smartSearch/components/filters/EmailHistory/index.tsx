import { MenuItem } from '@mui/material';
import { useState } from 'react';

import FilterForm from '../../FilterForm';
import { LIST_SELECT } from '../EmailClick';
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

enum EMAIL_STATUS_OP {
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
  const [listSelectType, setListSelectType] = useState<LIST_SELECT>(
    filter.config.campaign
      ? LIST_SELECT.FROM_PROJECT
      : filter.config.email
      ? LIST_SELECT.SPECIFIC_EMAIL
      : LIST_SELECT.ANY
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

  const convertToMessageKey = (value: string) => {
    return value.replace(/_(.)/, (_, char) => char.toUpperCase());
  };

  console.log(filter, 'filter');

  return (
    <FilterForm
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
            emailSelect: (
              <>
                {''}
                {listSelectType === LIST_SELECT.SPECIFIC_EMAIL && (
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
                )}
              </>
            ),
            listSelect: (
              <StyledSelect
                onChange={(e) => {
                  removeKey(['email', 'campaign']);
                  setListSelectType(e.target.value as LIST_SELECT);
                }}
                value={listSelectType}
              >
                {Object.values(LIST_SELECT).map((item) => (
                  <MenuItem key={item} value={item}>
                    <Msg id={messageIds.filters.emailListSelect[item]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            projectSelect: (
              <>
                {''}
                {listSelectType === LIST_SELECT.FROM_PROJECT && (
                  <StyledSelect
                    onChange={(e) =>
                      setValueToKey('campaign', parseInt(e.target.value))
                    }
                    value={filter.config.campaign || ''}
                  >
                    {projectsFuture?.map((project) => (
                      <MenuItem
                        key={`proejct-${project.id}`}
                        value={project.id}
                      >
                        {`"${project.title}"`}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                )}
              </>
            ),
            statusSelect: (
              <StyledSelect
                onChange={(e) => setValueToKey('operator', e.target.value)}
                value={filter.config.operator}
              >
                {Object.values(EMAIL_STATUS_OP).map((status) => (
                  <MenuItem key={status} value={status}>
                    <Msg
                      id={
                        localMessageIds.statusSelect[
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
