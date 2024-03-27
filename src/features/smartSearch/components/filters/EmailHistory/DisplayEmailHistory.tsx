import convertToMessageKey from './convertToMessageKey';
import DisplayTimeFrame from '../DisplayTimeFrame';
import { EMAIL_SELECT_SCOPE } from '../EmailClick';
import { getTimeFrameWithConfig } from '../../utils';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useEmails from 'features/emails/hooks/useEmails';
import { useNumericRouteParams } from 'core/hooks';
import {
  EmailHistoryFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

const localMessageIds = messageIds.filters.emailHistory;

interface DisplayEmailHistoryProps {
  filter: SmartSearchFilterWithId<EmailHistoryFilterConfig>;
}

const DisplayEmailHistory = ({
  filter,
}: DisplayEmailHistoryProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const emails = useEmails(orgId).data || [];
  const projects = useCampaigns(orgId).data || [];

  const { config } = filter;
  const { operator, campaign: projectId, email: emailId } = config;

  const op = filter.op || OPERATION.ADD;
  const emailTitle = emails?.find((item) => item.id === emailId)?.title;
  const projectTitle = projects?.find((item) => item.id === projectId)?.title;

  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        emailScopeSelect: (
          <UnderlinedMsg
            id={
              messageIds.filters.emailScopeSelect[
                filter.config.campaign
                  ? EMAIL_SELECT_SCOPE.FROM_PROJECT
                  : filter.config.email
                  ? EMAIL_SELECT_SCOPE.SPECIFIC_EMAIL
                  : EMAIL_SELECT_SCOPE.ANY
              ]
            }
          />
        ),
        emailSelect: emailId ? (
          <UnderlinedText text={`"${emailTitle}"`} />
        ) : null,
        operatorSelect: (
          <UnderlinedMsg
            id={
              localMessageIds.operatorSelect[
                convertToMessageKey(operator) as
                  | 'notSent'
                  | 'opened'
                  | 'sent'
                  | 'notSent'
              ]
            }
          />
        ),
        projectSelect: projectId ? (
          <UnderlinedText text={`"${projectTitle}"`} />
        ) : null,
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayEmailHistory;
