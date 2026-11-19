import { FC, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { MarkEmailReadOutlined, VolumeOff } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import usePersonOrgEmailPreferences from 'features/emails/hooks/usePersonOrgEmailPreferences';
import usePersonOrgEmailPreferencesMutations from 'features/emails/hooks/usePersonEmailPreferencesMutations';
import { useMessages } from 'core/i18n';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIButton from 'zui/components/ZUIButton';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinOrganization, ZetkinPerson } from 'utils/types/zetkin';
import {
  ZetkinEmailChannel,
  ZetkinPersonEmailChannelPreference,
  ZetkinPersonOrgEmailPreferences,
} from 'features/emails/types';
import usePersonEmailChannelPreferences from 'features/emails/hooks/usePersonEmailChannelPreferences';
import ZUIFutures from 'zui/ZUIFutures';
import usePersonEmailChannelPreferencesMutations from 'features/emails/hooks/usePersonEmailChannelPreferencesMutations';
import EmailChannelList from 'features/profile/components/EmailChannelList';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIDivider from 'zui/components/ZUIDivider';

type Props = {
  orgId: number;
  person: ZetkinPerson;
};

const PersonEmailPreferencesCard: FC<Props> = ({ orgId, person }) => {
  const organizationFuture = useOrganization(orgId);
  const orgPreferencesFuture = usePersonOrgEmailPreferences(orgId, person.id);
  const [channelPreferencesFuture, channelById] =
    usePersonEmailChannelPreferences(orgId, person.id);

  if (!Object.entries(channelById).length) {
    return null;
  }

  return (
    <ZUIFutures
      futures={{
        channelPreferences: channelPreferencesFuture,
        orgPreferences: orgPreferencesFuture,
        organization: organizationFuture,
      }}
      loadingIndicator={<Skeleton height={300} variant="rounded" />}
    >
      {({ data: { channelPreferences, orgPreferences, organization } }) => (
        <EmailPreferencesSection
          channelPreferences={channelPreferences}
          channelsById={channelById}
          organization={organization}
          orgPreferences={orgPreferences}
          person={person}
        />
      )}
    </ZUIFutures>
  );
};

type EmailPreferencesSectionProps = {
  channelPreferences: ZetkinPersonEmailChannelPreference[];
  channelsById: Record<number, ZetkinEmailChannel>;
  orgPreferences: ZetkinPersonOrgEmailPreferences;
  organization: ZetkinOrganization;
  person: ZetkinPerson;
};

const EmailPreferencesSection: FC<EmailPreferencesSectionProps> = ({
  channelPreferences,
  channelsById,
  organization,
  person,
  orgPreferences,
}) => {
  const messages = useMessages(messageIds);
  const toggleOrgMuted = usePersonOrgEmailPreferencesMutations(
    organization.id,
    person.id
  );
  const toggleChannelMuted = usePersonEmailChannelPreferencesMutations(
    organization.id,
    person.id
  );
  const [isLoadingOrgMuteStatus, setIsLoadingOrgMuteStatus] = useState(false);

  const orgMuted = orgPreferences.org_status === 'muted';
  const hasChannels = channelPreferences.length > 0;

  if (orgMuted) {
    return (
      <ZUISection
        renderContent={() => (
          <ZUIAlert
            button={{
              label: messages.emailPreferences.orgMuted.button(),
              onClick: async () => {
                setIsLoadingOrgMuteStatus(true);
                try {
                  await toggleOrgMuted(false);
                } catch {
                  //TODO: Display error message?
                } finally {
                  setIsLoadingOrgMuteStatus(false);
                }
              },
              startIcon: MarkEmailReadOutlined,
            }}
            description={messages.emailPreferences.orgMuted.description({
              name: person.first_name,
              orgName: organization.title,
            })}
            severity="info"
            title={messages.emailPreferences.orgMuted.title({
              orgName: organization.title,
            })}
          />
        )}
        title={messages.emailPreferences.title()}
      />
    );
  }

  return (
    <ZUISection
      renderContent={() => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <ZUIText variant="headingSm">
                {messages.emailPreferences.channels.title()}
              </ZUIText>
              {hasChannels && (
                <ZUIText color="secondary">
                  {messages.emailPreferences.channels.description({
                    name: person.first_name,
                  })}
                </ZUIText>
              )}
              {!hasChannels && (
                <ZUIText color="secondary">
                  {messages.emailPreferences.channels.empty()}
                </ZUIText>
              )}
            </Box>
            <EmailChannelList
              channels={channelsById}
              onToggleChannel={(checked, channelId) =>
                toggleChannelMuted(!checked, channelId)
              }
              preferences={channelPreferences}
            />
          </Box>
          <ZUIDivider />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ZUIText variant="headingSm">
              {messages.emailPreferences.muteAll.title()}
            </ZUIText>
            <ZUIText color="secondary">
              {messages.emailPreferences.muteAll.description({
                name: person.first_name,
              })}
            </ZUIText>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ZUIButton
                isLoading={isLoadingOrgMuteStatus}
                label={messages.emailPreferences.muteAll.button()}
                onClick={async () => {
                  setIsLoadingOrgMuteStatus(true);
                  try {
                    await toggleOrgMuted(true);
                  } catch {
                    //TODO: Display error message?
                  } finally {
                    setIsLoadingOrgMuteStatus(false);
                  }
                }}
                startIcon={VolumeOff}
                variant="secondary"
              />
            </Box>
          </Box>
        </Box>
      )}
      subtitle={person.email || ''}
      title={messages.emailPreferences.title()}
    />
  );
};

export default PersonEmailPreferencesCard;
