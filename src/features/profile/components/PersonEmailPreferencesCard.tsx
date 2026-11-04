import { FC, useContext, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
  ExpandMore,
  ForwardToInbox,
  MailOutline,
  Notifications,
  VolumeOff,
} from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import newTheme from 'zui/theme';
import useEmailChannels from 'features/emails/hooks/useEmailChannels';
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
  ZetkinEmailChannel,
  ZetkinPersonEmailPreferences,
} from 'features/emails/types';

type Props = {
  orgId: number;
  person: ZetkinPerson;
};

const PersonEmailPreferencesCard: FC<Props> = ({ orgId, person }) => {
  const channelsFuture = useEmailChannels(orgId);
  const preferencesFuture = usePersonEmailPreferences(orgId, person.id);

  if (channelsFuture.error || channelsFuture.data?.length === 0) {
    return null;
  }

  return (
    <ThemeProvider theme={newTheme}>
      <ZUIFuture
        future={preferencesFuture}
        skeleton={<Skeleton height={300} variant="rounded" />}
      >
        {(preferences) => (
          <EmailPreferencesSection
            channels={channelsFuture.data ?? []}
            orgId={orgId}
            person={person}
            preferences={preferences}
          />
        )}
      </ZUIFuture>
    </ThemeProvider>
  );
};

const EmailPreferencesSection: FC<
  Props & {
    channels: ZetkinEmailChannel[];
    preferences: ZetkinPersonEmailPreferences;
  }
> = ({ channels, orgId, person, preferences }) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { muteChannel, muteOrg, subscribeToChannel, unmuteChannel, unmuteOrg } =
    usePersonEmailPreferencesMutations(orgId, person.id);
  const [subscribeAnchorEl, setSubscribeAnchorEl] =
    useState<HTMLElement | null>(null);

  const name = `${person.first_name} ${person.last_name}`;
  const hasChannels = preferences.channels.length > 0;

  const run = async (mutation: () => Promise<void>) => {
    try {
      await mutation();
    } catch (err) {
      showSnackbar('error');
    }
  };

  const confirmUnmute = (mutedByPerson: boolean, unmute: () => void) => {
    if (mutedByPerson) {
      showConfirmDialog({
        onSubmit: unmute,
        warningText: messages.emailPreferences.unmuteWarning({ name }),
      });
    } else {
      unmute();
    }
  };

  const subscribedChannelIds = preferences.channels
    .filter((preference) => preference.status == 'subscribed')
    .map((preference) => preference.channel.id);
  const subscribableChannels = channels.filter(
    (channel) => channel.is_public && !subscribedChannelIds.includes(channel.id)
  );

  const renderSubscribeButton = () => (
    <>
      <ZUIButton
        disabled={preferences.muted}
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
                onClick: () => {
                  setSubscribeAnchorEl(null);
                  run(() => subscribeToChannel(channel.id));
                },
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
  );

  if (preferences.muted) {
    return (
      <ZUISection
        renderContent={() => (
          <ZUIAlert
            button={{
              label: messages.emailPreferences.orgMuted.button(),
              onClick: () =>
                confirmUnmute(preferences.muted_by_user_id === null, () =>
                  run(unmuteOrg)
                ),
              startIcon: ForwardToInbox,
            }}
            description={messages.emailPreferences.orgMuted.description()}
            severity="info"
            title={messages.emailPreferences.orgMuted.title()}
          />
        )}
        renderRightHeaderContent={renderSubscribeButton}
        title={messages.emailPreferences.title()}
      />
    );
  }

  return (
    <ZUISection
      renderRightHeaderContent={renderSubscribeButton}
      subSectionOrientation="vertical"
      subSections={[
        {
          renderContent: () => (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {!hasChannels && (
                <ZUIText color="secondary">
                  {messages.emailPreferences.channels.empty({ name })}
                </ZUIText>
              )}
              {preferences.channels.map((preference, index) => {
                const { channel, status } = preference;
                const isMuted = status == 'muted';
                const color = isMuted ? 'secondary' : 'primary';

                return (
                  <Box key={channel.id}>
                    {index > 0 && <ZUIDivider />}
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        gap: '0.75rem',
                        paddingY: '0.75rem',
                      }}
                    >
                      <ZUIIcon color={color} icon={MailOutline} />
                      <Box sx={{ flex: 1 }}>
                        <ZUIText color={color}>{channel.title}</ZUIText>
                      </Box>
                      <ZUISwitch
                        checked={!isMuted}
                        label=""
                        onChange={(checked) => {
                          if (checked) {
                            confirmUnmute(
                              preference.updated_by_user_id === null,
                              () => run(() => unmuteChannel(channel.id))
                            );
                          } else {
                            run(() => muteChannel(channel.id));
                          }
                        }}
                      />
                    </Box>
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
                  label={messages.emailPreferences.muteAll.button()}
                  onClick={() => run(muteOrg)}
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

export default PersonEmailPreferencesCard;
