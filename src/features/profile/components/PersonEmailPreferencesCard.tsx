import { FC, useContext, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import {
  ExpandMore,
  ForwardToInbox,
  MailOutline,
  Notifications,
  VolumeOff,
} from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';
import usePersonEmailPreferences from 'features/emails/hooks/usePersonEmailPreferences';
import usePersonEmailPreferencesMutations from 'features/emails/hooks/usePersonEmailPreferencesMutations';
import { useMessages } from 'core/i18n';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIButton from 'zui/components/ZUIButton';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIIcon from 'zui/components/ZUIIcon';
import ZUIMenu from 'zui/components/ZUIMenu';
import ZUISection from 'zui/components/ZUISection';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUISwitch from 'zui/components/ZUISwitch';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinPerson } from 'utils/types/zetkin';
import {
  ZetkinChannelStatus,
  ZetkinPersonChannelPreference,
  ZetkinPersonEmailPreferences,
} from 'features/emails/types';

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

  return (
    <ZUIFuture
      future={preferencesFuture}
      skeleton={<Skeleton height={300} variant="rounded" />}
    >
      {(preferences) => (
        <EmailPreferencesSection
          orgId={orgId}
          person={person}
          preferences={preferences}
        />
      )}
    </ZUIFuture>
  );
};

const EmailPreferencesSection: FC<
  Props & {
    preferences: ZetkinPersonEmailPreferences;
  }
> = ({ orgId, person, preferences }) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { muteChannel, setOrgMuted, subscribeToChannel, unmuteChannel } =
    usePersonEmailPreferencesMutations(orgId, person.id);
  const [subscribeAnchorEl, setSubscribeAnchorEl] =
    useState<HTMLElement | null>(null);
  const [isPending, setIsPending] = useState(false);

  const name = `${person.first_name} ${person.last_name}`;
  const orgMuted = !!preferences.org_muted.muted;
  const hasChannels = preferences.channels.length > 0;

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
                  preferences.org_muted.muted_by_user_id === null,
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

  const subscribableChannels = preferences.channels.filter(
    (channel) =>
      !!channel.published &&
      (channel.status == 'has_received' || channel.status == 'no_relationship')
  );

  return (
    <ZUISection
      renderRightHeaderContent={() => (
        <>
          <ZUIButton
            disabled={isPending}
            endIcon={ExpandMore}
            label={messages.emailPreferences.subscribe.button()}
            onClick={(ev) => setSubscribeAnchorEl(ev.currentTarget)}
            size="small"
            startIcon={Notifications}
            variant="secondary"
          />
          <ZUIMenu
            anchorEl={subscribeAnchorEl}
            invertHorizontalAnchor
            menuItems={
              subscribableChannels.length
                ? subscribableChannels.map((channel) => ({
                    label: channel.title,
                    onClick: () => run(() => subscribeToChannel(channel.id)),
                  }))
                : [
                    {
                      disabled: true,
                      label: messages.emailPreferences.subscribe.noChannels(),
                      onClick: () => null,
                    },
                  ]
            }
            onClose={() => setSubscribeAnchorEl(null)}
          />
        </>
      )}
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
              {preferences.channels.map((channel, index) => (
                <Box key={channel.id}>
                  {index > 0 && <ZUIDivider />}
                  <ChannelPreferenceRow
                    channel={channel}
                    disabled={isPending}
                    onChange={(checked) => {
                      if (checked) {
                        confirmUnmute(
                          channel.muted_by_user_id === null,
                          messages.emailPreferences.unmuteConfirm.channelTitle({
                            channel: channel.title,
                          }),
                          () => run(() => unmuteChannel(channel))
                        );
                      } else {
                        run(() => muteChannel(channel.id));
                      }
                    }}
                  />
                </Box>
              ))}
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

const ChannelPreferenceRow: FC<{
  channel: ZetkinPersonChannelPreference;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}> = ({ channel, disabled, onChange }) => {
  const messages = useMessages(messageIds);
  const isMuted = channel.status == 'channel_muted';
  const color = isMuted ? 'secondary' : 'primary';

  const statusMessages = messages.emailPreferences.channels.status;
  const statusLabels: Record<ZetkinChannelStatus, string> = {
    channel_muted: statusMessages.muted(),
    has_received: statusMessages.notSubscribed(),
    no_relationship: statusMessages.notSubscribed(),
    org_muted: statusMessages.muted(),
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
          {statusLabels[channel.status]}
        </ZUIText>
      </Box>
      <ZUISwitch
        ariaLabel={channel.title}
        checked={!isMuted}
        disabled={disabled}
        label=""
        onChange={onChange}
      />
    </Box>
  );
};

export default PersonEmailPreferencesCard;
