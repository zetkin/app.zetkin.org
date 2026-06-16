'use client';

import { Box } from '@mui/material';
import { MailOutline } from '@mui/icons-material';
import { FC, useState } from 'react';

import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUISwitch from 'zui/components/ZUISwitch';
import { EmailChannel } from '../types';

const MOCK_EMAIL = 'person@thirdpartyemailprovider.org';

type Props = {
  initialChannels: EmailChannel[];
  org: ZetkinOrganization;
  token: string;
};

const SubscriptionsManagementPage: FC<Props> = ({
  initialChannels,
  org,
  token,
}) => {
  const [channels, setChannels] = useState(initialChannels);

  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'white',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ maxWidth: 430, p: 3, width: '100%' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
            mb: 2,
            px: '1.25rem',
          }}
        >
          <ZUIOrgLogoAvatar orgId={org.id} />
          <ZUIText variant="bodyMdSemiBold">{org.title}</ZUIText>
        </Box>

        <ZUISection
          subSectionOrientation="vertical"
          subSections={[
            {
              renderContent: () => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <Box>
                    {channels.map((channel, index) => {
                      const isActive = channel.subscription === 'subscribed';
                      const isLast = index === channels.length - 1;
                      return (
                        <>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                              justifyContent: 'space-between',
                              paddingBottom: !isLast ? 1 : 0,
                              paddingTop: index === 0 ? 0 : 1,
                            }}
                          >
                            <Box
                              sx={{
                                alignItems: 'flex-start',
                                display: 'flex',
                                gap: 1,
                              }}
                            >
                              <MailOutline
                                sx={(theme) => ({
                                  color: isActive
                                    ? theme.palette.text.primary
                                    : theme.palette.text.disabled,
                                  fontSize: '1.5rem',
                                })}
                              />
                              <ZUIText
                                sx={(theme) => ({
                                  color: isActive
                                    ? theme.palette.text.primary
                                    : theme.palette.text.disabled,
                                })}
                                variant="bodyMdSemiBold"
                              >
                                {channel.title}
                              </ZUIText>
                            </Box>
                            <ZUISwitch
                              checked={isActive}
                              label={isActive ? 'On' : 'Off'}
                              labelPlacement="start"
                              onChange={async (newState) => {
                                const patchRes = await fetch(
                                  `/api2/orgs/${org.id}/channels/${channel.id}`,
                                  // does this return the entire channel, with patched data?
                                  {
                                    body: JSON.stringify({
                                      subscription: newState
                                        ? 'subscribed'
                                        : 'blocked',
                                    }),
                                    headers: new Headers({
                                      Authorization: `Bearer ${token}`,
                                      'Content-Type': 'application/json',
                                    }),
                                    method: 'patch',
                                  }
                                );
                                const updatedChannel: EmailChannel =
                                  await patchRes.json();
                                // Find and replace channel
                                setChannels([
                                  ...channels.filter(
                                    (chan) => chan.id === updatedChannel.id
                                  ),
                                  updatedChannel,
                                ]);
                              }}
                            />
                          </Box>
                          {!isLast && <ZUIDivider />}
                        </>
                      );
                    })}
                  </Box>
                </Box>
              ),
              subtitle: 'Turn a channel off to stop receiving its emails.',
              title: 'Channels',
            },
          ]}
          subtitle={MOCK_EMAIL}
          title={`Email settings`}
        />
      </Box>
    </Box>
  );
};

export default SubscriptionsManagementPage;
