'use client';

import { Box, List, ListItem, Stack } from '@mui/material';
import { Block, MailOutline } from '@mui/icons-material';
import { FC, useState } from 'react';

import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUISwitch from 'zui/components/ZUISwitch';
import { EmailChannel } from '../types';
import ZUIAlert from 'zui/components/ZUIAlert';

type Props = {
  email: string;
  initialChannels: EmailChannel[];
  org: ZetkinOrganization;
  token: string;
};

const SubscriptionsManagementPage: FC<Props> = ({
  email,
  initialChannels,
  org,
  token,
}) => {
  const [blockAll, setBlockAll] = useState(false);
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
                <Stack gap={1} useFlexGap>
                  {blockAll && (
                    <ZUIAlert
                      button={{
                        label: 'Unblock',
                        onClick: () => setBlockAll(false),
                      }}
                      description={`You have blocked all mass email from ${org.title}.`}
                      severity="info"
                      title="Mass email is blocked"
                    />
                  )}
                  <List sx={{ padding: 0 }}>
                    {channels.map((channel, index) => {
                      const isActive = !channel.is_blocked;
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
                            <MailOutline
                              color={blockAll ? 'disabled' : 'primary'}
                              sx={() => ({
                                fontSize: '1.5rem',
                              })}
                            />
                            <ZUIText color={blockAll ? 'secondary' : 'primary'}>
                              {channel.title}
                            </ZUIText>
                          </Box>
                          <ZUISwitch
                            checked={isActive}
                            disabled={blockAll}
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
                        </ListItem>
                      );
                    })}
                  </List>
                </Stack>
              ),
              subtitle: 'Turn a channel off to stop receiving its emails.',
              title: 'Channels',
            },
            {
              renderContent: () => {
                return (
                  <Box>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 4,
                        justifyContent: 'space-between',
                        paddingBottom: 1,
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: 'flex-start',
                          display: 'flex',
                          gap: 1,
                        }}
                      >
                        <Block
                          sx={() => ({
                            fontSize: '1.5rem',
                          })}
                        />
                        <ZUIText>{'Block all mass emails'}</ZUIText>
                      </Box>
                      <ZUISwitch
                        checked={blockAll}
                        label="Block"
                        labelPlacement="start"
                        onChange={(newState) => setBlockAll(newState)}
                      />
                    </Box>
                  </Box>
                );
              },
              subtitle:
                'You may still receive reminders and other email sent specifically to you as part of work you do in the organization',
              title: `Block all mass emails from ${org.title}`,
            },
          ]}
          subtitle={email}
          title={`Email settings`}
        />
      </Box>
    </Box>
  );
};

export default SubscriptionsManagementPage;
