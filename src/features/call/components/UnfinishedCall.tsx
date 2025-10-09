import { FC } from 'react';
import { Box } from '@mui/material';

import { ZetkinCall } from '../types';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  onAbandonCall: () => void;
  onSwitchToCall: () => void;
  unfinishedCall: ZetkinCall;
};

const UnfinishedCall: FC<Props> = ({
  onAbandonCall,
  onSwitchToCall,
  unfinishedCall,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Box
      key={unfinishedCall.id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        paddingY: 1,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            gap: 1,
            minWidth: 0,
          }}
        >
          <ZUIPersonAvatar
            firstName={unfinishedCall.target.first_name}
            id={unfinishedCall.target.id}
            lastName={unfinishedCall.target.last_name}
            size="medium"
          />
          <ZUIText noWrap variant="bodyMdSemiBold">
            {unfinishedCall.target.name}
          </ZUIText>
        </Box>
        <Box display="flex" gap={1}>
          <ZUIButton
            label={messages.callLog.unfinishedCall.abandon()}
            onClick={() => onAbandonCall()}
            size="small"
            variant="tertiary"
          />
          <ZUIButton
            label={messages.callLog.unfinishedCall.switch()}
            onClick={() => onSwitchToCall()}
            size="small"
            variant="primary"
          />
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: 5,
          width: '100%',
        }}
      >
        <ZUIText variant="bodyMdRegular">{unfinishedCall.target.phone}</ZUIText>
        <ZUIText color="secondary" noWrap>
          <ZUIRelativeTime datetime={unfinishedCall.update_time} />
        </ZUIText>
      </Box>
    </Box>
  );
};

export default UnfinishedCall;
