import { FormControl, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import { COLUMN_TYPE, SelectedViewColumn } from '../types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useEmailChannels from 'features/emails/hooks/useEmailChannels';
import StyledAutocomplete from 'features/smartSearch/components/inputs/StyledAutocomplete';

interface ChannelSubscriptionConfigProps {
  onOutputConfigured: (columns: SelectedViewColumn[]) => void;
}

const ChannelSubscriptionConfig = ({
  onOutputConfigured,
}: ChannelSubscriptionConfigProps) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const channels = useEmailChannels(orgId).data || [];
  const [channelId, setChannelId] = useState<number | undefined>();

  const onChannelChange = (
    ev: SyntheticEvent & { target: { value: string } }
  ) => {
    if (!ev.target.value) {
      return;
    }
    const channelId = +ev.target.value;
    setChannelId(channelId);
    onOutputConfigured([
      {
        config: {
          channel_id: channelId,
        },
        title:
          channels.find((channel) => channel.id === channelId)?.title || '',
        type: COLUMN_TYPE.CHANNEL_SUBSCRIPTION,
      },
    ]);
  };

  return channels.length > 0 ? (
    <FormControl sx={{ width: 300 }}>
      <StyledAutocomplete
        clearable={true}
        items={channels.map((channel) => ({
          id: channel.id,
          label: channel.title,
        }))}
        label={messages.columnDialog.editor.fieldLabels.channel()}
        onChange={onChannelChange}
        sx={{
          '& .MuiInputBase-input': {
            textOverflow: 'ellipsis',
          },
          '& .MuiInputBase-root .MuiInputBase-input': {
            fontSize: 'inherit',
          },
          '&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot':
            {
              paddingRight: '24px',
            },
          width: '100%',
        }}
        value={channelId}
      />
    </FormControl>
  ) : (
    <Typography>
      <Msg
        id={messageIds.columnDialog.choices.channelSubscription.noChannels}
      />
    </Typography>
  );
};

export default ChannelSubscriptionConfig;
