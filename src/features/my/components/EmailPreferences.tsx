import { Cancel, MailOutline } from '@mui/icons-material';
import { Box, List, ListItem } from '@mui/material';
import { FC, useState } from 'react';

import { ZetkinUser } from 'utils/types/zetkin';
import ZUIButton from 'zui/components/ZUIButton';
import ZUISection from 'zui/components/ZUISection';
import ZUISelect from 'zui/components/ZUISelect';
import useUserMemberships from 'features/public/hooks/useUserMemberships';
import ZUISwitch from 'zui/components/ZUISwitch';
import ZUIText from 'zui/components/ZUIText';
import ZUIIcon from 'zui/components/ZUIIcon';
import ZUIAlert from 'zui/components/ZUIAlert';
import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

type Props = {
  user: ZetkinUser;
};

const initialChannels = [
  {
    id: 234,
    is_blocked: false,
    published: '20250212',
    published_by_user_id: 1231,
    sender_email: 'cutest@cat.com',
    sender_name: 'Catttt',
    title: 'Cat channel',
  },
  {
    id: 233,
    is_blocked: true,
    published: '20250212',
    published_by_user_id: 345,
    sender_email: 'min@cat.com',
    sender_name: 'Nana',
    title: 'Dog channel',
  },
];

type MuteAllProps = {
  onMuteAll: () => void;
};

const MuteAll: FC<MuteAllProps> = ({ onMuteAll }) => {
  const messages = useMessages(messageIds);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <ZUIText>
        <Msg id={messageIds.settings.email.muteAll.description} />
      </ZUIText>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <ZUIButton
          label={messages.settings.email.muteAll.muteButton()}
          onClick={() => onMuteAll()}
          startIcon={Cancel}
          variant="secondary"
        />
      </Box>
    </Box>
  );
};

const Channels: FC = () => {
  const [channels, setChannels] = useState(initialChannels);

  return (
    <List sx={{ padding: 0 }}>
      {channels.map((channel, index) => {
        const isFirst = index === 0;
        const isLast = index === channels.length - 1;
        return (
          <ListItem
            key={channel.id}
            divider={!isLast}
            sx={{
              alignItems: 'center',
              display: 'flex',
              gap: 4,
              justifyContent: 'space-between',
              paddingBottom: 1,
              paddingTop: !isFirst ? 1 : 0,
              paddingX: 0,
            }}
          >
            <Box
              sx={{
                alignItems: 'flex-start',
                display: 'flex',
                gap: 1,
              }}
            >
              <ZUIIcon
                color={channel.is_blocked ? 'secondary' : 'primary'}
                icon={MailOutline}
              />
              <ZUIText color={channel.is_blocked ? 'secondary' : 'primary'}>
                {channel.title}
              </ZUIText>
            </Box>
            <ZUISwitch
              checked={!channel.is_blocked}
              label={channel.is_blocked ? 'Muted' : 'Active'}
              labelPlacement="start"
              onChange={(checked) => {
                //TODO: Change channel subscription state
                const index = channels.indexOf(channel);
                const updated = channels.toSpliced(index, 1, {
                  ...channel,
                  is_blocked: !checked,
                });

                setChannels(updated);
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

const EmailPreferences: FC<Props> = ({ user }) => {
  const messages = useMessages(messageIds);

  const [allMuted, setAllMuted] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const memberships = useUserMemberships();
  const organizations = memberships.map(
    (membership) => membership.organization
  );
  const selectedOrganization = organizations.find(
    (org) => selectedOrgId && org.id === +selectedOrgId
  );

  return (
    <ZUISection
      subSectionOrientation="vertical"
      subSections={[
        {
          renderContent: () => (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ZUISelect
                fullWidth
                items={organizations.map((org) => ({
                  label: org.title,
                  value: org.id.toString(),
                }))}
                label={messages.settings.email.organization.dropdownLabel()}
                onChange={(newValue) => {
                  setSelectedOrgId(newValue);
                }}
                selectedOption={selectedOrgId?.toString() || ''}
              />
              {selectedOrganization && allMuted && (
                <ZUIAlert
                  button={{
                    label: messages.settings.email.allMuted.unmuteButton(),
                    onClick: () => setAllMuted(false),
                  }}
                  description={messages.settings.email.allMuted.description()}
                  severity="info"
                  title={messages.settings.email.allMuted.title({
                    orgTitle: selectedOrganization.title,
                  })}
                />
              )}
            </Box>
          ),
          subtitle: messages.settings.email.organization.description(),
          title: 'Organization',
        },
        ...(selectedOrganization && !allMuted
          ? [
              {
                renderContent: () => {
                  return <Channels />;
                },
                subtitle: messages.settings.email.channels.description(),
                title: messages.settings.email.channels.title(),
              },
              {
                renderContent: () => {
                  return <MuteAll onMuteAll={() => setAllMuted(true)} />;
                },
                title: messages.settings.email.muteAll.title({
                  orgTitle: selectedOrganization.title,
                }),
              },
            ]
          : []),
      ]}
      subtitle={user.email}
      title={messages.settings.email.title()}
    />
  );
};

export default EmailPreferences;
