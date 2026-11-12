'use client';

import { Box, List, ListItem, Stack } from '@mui/material';
import { Cancel, MailOutline } from '@mui/icons-material';
import { FC, useState } from 'react';

import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUISwitch from 'zui/components/ZUISwitch';
import { EmailChannel } from '../types';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIButton from 'zui/components/ZUIButton';

type Props = {
  email: string;
  initialChannels: EmailChannel[];
  org: ZetkinOrganization;
};

const SubscriptionsManagementPage: FC<Props> = ({
  email,
  initialChannels,
  org,
}) => {
  const [allMuted, setAllMuted] = useState(false);
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

        {allMuted && (
          <ZUISection
            renderContent={() => (
              <ZUIAlert
                button={{ label: 'do thing' }}
                severity="info"
                title="alert!"
              />
            )}
            subtitle={email}
            title={`Email settings for`}
          />
        )}
        {!allMuted && (
          <ZUISection
            subSectionOrientation="vertical"
            subSections={[
              {
                renderContent: () => {
                  return (
                    <Stack gap={1} useFlexGap>
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
                                  color={allMuted ? 'disabled' : 'primary'}
                                  sx={() => ({
                                    fontSize: '1.5rem',
                                  })}
                                />
                                <ZUIText
                                  color={allMuted ? 'secondary' : 'primary'}
                                >
                                  {channel.title}
                                </ZUIText>
                              </Box>
                              <ZUISwitch
                                checked={isActive}
                                disabled={allMuted}
                                label={isActive ? 'Active' : 'Muted'}
                                labelPlacement="start"
                                onChange={() => {
                                  //TODO: Change channel subscription state
                                  setChannels([]);
                                }}
                              />
                              {}
                            </ListItem>
                          );
                        })}
                      </List>
                    </Stack>
                  );
                },
                subtitle:
                  'These are the channels you have received emails from. You can mute and unmute them to stop or start receiving emails from them.',
                title: 'Channels',
              },
              {
                renderContent: () => {
                  return (
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                      <ZUIText>
                        You may still receive reminders and other email sent
                        specifically to you as part of work you do in the
                        organization.
                      </ZUIText>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          width: '100%',
                        }}
                      >
                        <ZUIButton
                          label="Mute all"
                          onClick={() => setAllMuted(true)}
                          startIcon={Cancel}
                          variant="secondary"
                        />
                      </Box>
                    </Box>
                  );
                },
                title: `Mute all mass emails from ${org.title}`,
              },
            ]}
            subtitle={email}
            title={`Email settings for`}
          />
        )}
      </Box>
    </Box>
  );
};

export default SubscriptionsManagementPage;
