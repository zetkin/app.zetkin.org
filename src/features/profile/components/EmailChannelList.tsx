import { List, ListItem } from '@mui/material';
import { FC } from 'react';
import { MailOutline, VolumeOff } from '@mui/icons-material';

import ZUIIcon from '../../../zui/components/ZUIIcon';
import ZUISwitch from '../../../zui/components/ZUISwitch';
import {
  ZetkinEmailChannel,
  ZetkinPersonEmailChannelPreference,
} from 'features/emails/types';

type Props = {
  channels: Record<number, ZetkinEmailChannel>;
  onToggleChannel: (checked: boolean, channelId: number) => void;
  preferences: ZetkinPersonEmailChannelPreference[];
};

const EmailChannelList: FC<Props> = ({
  channels,
  preferences,
  onToggleChannel,
}) => {
  return (
    <List sx={{ padding: 0 }}>
      {preferences.map((channelPreference, index) => {
        const isFirst = index === 0;
        const isLast = index === preferences.length - 1;
        const channel = channels[channelPreference.channel_id];

        return (
          <ListItem
            key={channel.id}
            divider={!isLast}
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: 1,
              paddingBottom: 1,
              paddingTop: !isFirst ? 1 : 0,
              paddingX: 0,
            }}
          >
            <ZUIIcon icon={channelPreference.muted ? VolumeOff : MailOutline} />
            <ZUISwitch
              checked={!channelPreference.muted}
              fullWidth
              label={channel.title}
              labelPlacement="start"
              onChange={(checked) => onToggleChannel(checked, channel.id)}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default EmailChannelList;
