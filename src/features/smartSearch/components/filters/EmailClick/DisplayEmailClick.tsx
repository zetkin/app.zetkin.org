import { Box, Chip, Tooltip } from '@mui/material';

import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useEmails from 'features/emails/hooks/useEmails';
import useLinks from 'features/emails/hooks/useLinks';
import { useNumericRouteParams } from 'core/hooks';
import { EMAIL_SELECT_SCOPE, LINK_SELECT_SCOPE } from '.';
import {
  EmailClickFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

const localMessageIds = messageIds.filters.emailClick;

interface DisplayEmailClickProps {
  filter: SmartSearchFilterWithId<EmailClickFilterConfig>;
}

const DisplayEmailClick = ({ filter }: DisplayEmailClickProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const emails = useEmails(orgId).data || [];
  const projects = useCampaigns(orgId).data || [];

  const { config } = filter;
  const { operator, campaign: projectId, email: emailId, links } = config;
  const linksFuture = useLinks(orgId, filter.config?.email).data;

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
        linkScopeSelect: (
          <UnderlinedMsg
            id={
              localMessageIds.linkScopeSelect[
                filter.config.links
                  ? LINK_SELECT_SCOPE.FOLLOWING_LINKS
                  : LINK_SELECT_SCOPE.ANY_LINK
              ]
            }
          />
        ),
        linkSelect: links ? (
          <Box alignItems="start" display="inline-flex">
            :{' '}
            {linksFuture
              ?.filter((item) => filter.config.links?.includes(item.id))
              .map((link) => {
                return (
                  <Tooltip key={`link-${link.id}`} title={link.url}>
                    <Chip
                      label={link.url.split('://')[1]}
                      size="small"
                      sx={{
                        margin: '3px',
                        maxWidth: '200px',
                        textOverflow: 'ellipsis',
                      }}
                      variant="outlined"
                    />
                  </Tooltip>
                );
              })}
          </Box>
        ) : null,
        operatorSelect: (
          <UnderlinedMsg
            id={
              localMessageIds.operatorSelect[
                operator === 'clicked' ? 'clicked' : 'notClicked'
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

export default DisplayEmailClick;
