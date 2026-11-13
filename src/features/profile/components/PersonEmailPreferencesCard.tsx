import { FC, useContext, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { ForwardToInbox, MailOutline, VolumeOff } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';
import usePersonEmailPreferences from 'features/emails/hooks/usePersonEmailPreferences';
import usePersonEmailPreferencesMutations from 'features/emails/hooks/usePersonEmailPreferencesMutations';
import { useMessages } from 'core/i18n';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIButton from 'zui/components/ZUIButton';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIIcon from 'zui/components/ZUIIcon';
import ZUISection from 'zui/components/ZUISection';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUISwitch from 'zui/components/ZUISwitch';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinPerson } from 'utils/types/zetkin';
import {
  ZetkinChannel,
  ZetkinChannelPreferenceStatus,
  ZetkinPersonChannelPreference,
  ZetkinPersonEmailPreferences,
} from 'features/emails/types';
import usePersonChannelPreferences from 'features/emails/hooks/usePersonChannelPreferences';
import ZUIFutures from 'zui/ZUIFutures';

type Props = {
  orgId: number;
  person: ZetkinPerson;
};

const PersonEmailPreferencesCard: FC<Props> = ({ orgId, person }) => {
  const configs = useEmailConfigs(orgId).data;

  if (!configs?.length) {
    return null;
  }

  return <EmailPreferences orgId={orgId} person={person} />;
};

const EmailPreferences: FC<Props> = ({ orgId, person }) => {
  const preferencesFuture = usePersonEmailPreferences(orgId, person.id);
  const [channelPreferencesFuture, channels] = usePersonChannelPreferences(
    orgId,
    person.id
  );

  return (
    <ZUIFutures
      futures={{
        channelPreferences: channelPreferencesFuture,
        preferences: preferencesFuture,
      }}
      loadingIndicator={<Skeleton height={300} variant="rounded" />}
    >
      {({ data: { channelPreferences, preferences } }) => (
        <EmailPreferencesSection
          channelPreferences={channelPreferences}
          channels={channels}
          orgId={orgId}
          person={person}
          preferences={preferences}
        />
      )}
    </ZUIFutures>
  );
};

const EmailPreferencesSection: FC<
  Props & {
    channelPreferences: ZetkinPersonChannelPreference[];
    channels: Record<number, ZetkinChannel | undefined>;
    preferences: ZetkinPersonEmailPreferences;
  }
> = ({ channelPreferences, channels, orgId, person, preferences }) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const {
    muteChannel,
    setOrgMuted,
    subscribeToChannel,
    unmuteChannel,
    unsubscribeFromChannel,
  } = usePersonEmailPreferencesMutations(orgId, person.id);
  const [isPending, setIsPending] = useState(false);

  const name = `${person.first_name} ${person.last_name}`;
  const orgMuted = preferences.org_status === 'muted';
  const hasChannels = channelPreferences.length > 0;

  const run = async (mutation: () => Promise<void>) => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    try {
      await mutation();
    } catch (err) {
      showSnackbar('error');
    } finally {
      setIsPending(false);
    }
  };

  const confirmUnmute = (
    mutedByPerson: boolean,
    title: string,
    unmute: () => void
  ) => {
    if (mutedByPerson) {
      showConfirmDialog({
        onSubmit: unmute,
        submitText: messages.emailPreferences.unmuteConfirm.button(),
        title,
        warningText: messages.emailPreferences.unmuteConfirm.warning({ name }),
      });
    } else {
      unmute();
    }
  };

  if (orgMuted) {
    return (
      <ZUISection
        renderContent={() => (
          <ZUIAlert
            button={{
              label: messages.emailPreferences.orgMuted.button(),
              onClick: () =>
                confirmUnmute(
                  preferences.org_muted_by_user_id === null,
                  messages.emailPreferences.unmuteConfirm.orgTitle(),
                  () => run(() => setOrgMuted(false))
                ),
              startIcon: ForwardToInbox,
            }}
            description={messages.emailPreferences.orgMuted.description({
              name,
            })}
            severity="info"
            title={messages.emailPreferences.orgMuted.title()}
          />
        )}
        title={messages.emailPreferences.title()}
      />
    );
  }

  const getRowAction = (
    channel: ZetkinChannel,
    channelPreference: ZetkinPersonChannelPreference
  ): ChannelRowAction | undefined => {
    // Unpublished channels can't be subscribed to again, so leave them as is
    if (channelPreference.status == 'subscribed' && !!channel.published) {
      return {
        label: messages.emailPreferences.unsubscribe.button(),
        onClick: () => run(() => unsubscribeFromChannel(channel.id)),
      };
    }

    const canSubscribe =
      !!channel.published &&
      (channelPreference.status == 'has_received' ||
        channelPreference.status == 'no_relationship');

    if (canSubscribe) {
      return {
        label: messages.emailPreferences.subscribe.button(),
        onClick: () => run(() => subscribeToChannel(channel.id)),
      };
    }
  };

  return (
    <ZUISection
      subSectionOrientation="vertical"
      subSections={[
        {
          renderContent: () => (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {!hasChannels && (
                <ZUIText color="secondary">
                  {messages.emailPreferences.channels.empty()}
                </ZUIText>
              )}
              {channelPreferences.map((channelPreference, index) => {
                const channel = channels[channelPreference.channel_id];
                if (!channel) {
                  return null;
                }

                return (
                  <Box key={channelPreference.channel_id}>
                    {index > 0 && <ZUIDivider />}
                    <ChannelPreferenceRow
                      action={getRowAction(channel, channelPreference)}
                      channel={channel}
                      channelPreference={channelPreference}
                      disabled={isPending}
                      onChange={(checked) => {
                        if (checked) {
                          confirmUnmute(
                            channelPreference.muted_by_user_id === null,
                            messages.emailPreferences.unmuteConfirm.channelTitle(
                              {
                                channel: channel.title,
                              }
                            ),
                            () =>
                              run(() =>
                                unmuteChannel(channel, channelPreference)
                              )
                          );
                        } else {
                          run(() => muteChannel(channelPreference.channel_id));
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          ),
          subtitle: hasChannels
            ? messages.emailPreferences.channels.description({ name })
            : undefined,
          title: messages.emailPreferences.channels.title(),
        },
        {
          renderContent: () => (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ZUIText color="secondary">
                {messages.emailPreferences.muteAll.description({ name })}
              </ZUIText>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ZUIButton
                  disabled={isPending}
                  label={messages.emailPreferences.muteAll.button()}
                  onClick={() => run(() => setOrgMuted(true))}
                  startIcon={VolumeOff}
                  variant="secondary"
                />
              </Box>
            </Box>
          ),
          title: messages.emailPreferences.muteAll.title(),
        },
      ]}
      title={messages.emailPreferences.title()}
    />
  );
};

type ChannelRowAction = {
  label: string;
  onClick: () => void;
};

const ChannelPreferenceRow: FC<{
  action?: ChannelRowAction;
  channel: ZetkinChannel;
  channelPreference: ZetkinPersonChannelPreference;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}> = ({ action, channel, channelPreference, disabled, onChange }) => {
  const messages = useMessages(messageIds);
  const isMuted = channelPreference.status == 'channel_muted';
  const color = isMuted ? 'secondary' : 'primary';

  const statusMessages = messages.emailPreferences.channels.status;
  const statusLabels: Record<ZetkinChannelPreferenceStatus, string> = {
    channel_muted: statusMessages.muted(),
    has_received: statusMessages.notSubscribed(),
    no_relationship: statusMessages.notSubscribed(),
    subscribed: statusMessages.subscribed(),
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: '0.75rem',
        paddingY: '0.75rem',
      }}
    >
      <ZUIIcon color={color} icon={MailOutline} />
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <ZUIText color={color}>{channel.title}</ZUIText>
        <ZUIText color="secondary" variant="bodySmRegular">
          {statusLabels[channelPreference.status]}
        </ZUIText>
      </Box>
      {action && (
        <ZUIButton
          disabled={disabled}
          label={action.label}
          onClick={action.onClick}
          size="small"
          variant="secondary"
        />
      )}
      <ZUISwitch
        checked={!isMuted}
        disabled={disabled}
        label=""
        onChange={onChange}
      />
    </Box>
  );
};

export default PersonEmailPreferencesCard;
