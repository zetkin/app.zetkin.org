import { Box, Chip } from '@mui/material';

import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';
import {
  ChannelSubscriptionFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import { ZetkinEmailConfig } from 'utils/types/zetkin';

const localMessageIds = messageIds.filters.channelSubscription;

interface DisplayChannelSubscriptionProps {
  filter: SmartSearchFilterWithId<ChannelSubscriptionFilterConfig>;
}

const DisplayChannelSubscription = ({
  filter,
}: DisplayChannelSubscriptionProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const channels = useEmailConfigs(orgId).data || [];
  const op = filter.op || OPERATION.ADD;
  const channelIds = filter.config.channels || [];
  const scope = channelIds.length
    ? filter.config.condition === 'all'
      ? 'allOf'
      : 'anyOf'
    : 'anyChannel';
  const operator =
    filter.config.operator === 'not_subscribed' ? 'notSubscribed' : 'subscribed';

  const selectedChannels = channelIds.reduce(
    (acc: ZetkinEmailConfig[], id) => {
      const channel = channels.find((channel) => channel.id === id);
      return channel ? acc.concat(channel) : acc;
    },
    []
  );

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        channels:
          scope === 'anyChannel' ? null : (
            <Box
              sx={{
                alignItems: 'start',
                display: 'inline-flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {selectedChannels.map((channel) => (
                <Chip
                  key={channel.id}
                  label={channel.sender_name}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          ),
        operatorSelect: (
          <UnderlinedMsg id={localMessageIds.operatorSelect[operator]} />
        ),
        scopeSelect: <UnderlinedMsg id={localMessageIds.scopeSelect[scope]} />,
      }}
    />
  );
};

export default DisplayChannelSubscription;
