'use client';

import { Box, List, ListItem, Stack } from '@mui/material';
import { FC, Suspense, useMemo, useState } from 'react';
import { Block, MailOutline } from '@mui/icons-material';

import useCurrentUser from 'features/user/hooks/useCurrentUser';
import AppPreferences from 'features/my/components/AppPreferences';
import AccountSettings from 'features/my/components/AccountSettings';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUISection from 'zui/components/ZUISection';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIText from 'zui/components/ZUIText';
import ZUISwitch from 'zui/components/ZUISwitch';
import useEmailChannels from 'features/public/hooks/useEmailChannels';
import useUserMemberships from 'features/public/hooks/useUserMemberships';
import { EmailChannel } from 'features/public/types';
import ZUIAutocomplete from 'zui/components/ZUIAutocomplete';

const SettingsPage: FC = () => {
  const initialChannels = useEmailChannels();

  const [blockAll, setBlockAll] = useState(false);
  const [channels, setChannels] = useState(initialChannels);
  const [selectedOrg, setSelectedOrg] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const user = useCurrentUser();
  const memberships = useUserMemberships();

  const organizations = useMemo(() => {
    return memberships.map((membership) => ({
      label: membership.organization.title,
      value: membership.organization.id.toString(),
    }));
  }, [memberships]);

  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={2}
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      {user && (
        <Stack gap={2} sx={{ paddingTop: 2 }}>
          <AppPreferences user={user} />
          <AccountSettings user={user} />
          <ZUISection
            subSectionOrientation="vertical"
            subSections={[
              {
                renderContent: () => (
                  <ZUIAutocomplete
                    label="Organization"
                    multiple={false}
                    onChange={(newSelectedOrg) =>
                      setSelectedOrg(newSelectedOrg)
                    }
                    options={organizations}
                    value={selectedOrg}
                  />
                ),
                title: 'Organization',
              },
              ...(selectedOrg
                ? [
                    {
                      renderContent: () => (
                        <Stack gap={1} useFlexGap>
                          {blockAll && (
                            <ZUIAlert
                              button={{
                                label: 'Unblock',
                                onClick: () => setBlockAll(false),
                              }}
                              description={`You have blocked all mass email from ${selectedOrg?.label}.`}
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
                                    <ZUIText
                                      color={blockAll ? 'secondary' : 'primary'}
                                    >
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
                                        `/api2/orgs/${selectedOrg.value}/channels/${channel.id}`,
                                        // does this return the entire channel, with patched data?
                                        {
                                          body: JSON.stringify({
                                            subscription: newState
                                              ? 'subscribed'
                                              : 'blocked',
                                          }),
                                          headers: new Headers({
                                            //Authorization: `Bearer ${token}`,
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
                                          (chan) =>
                                            chan.id === updatedChannel.id
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
                      subtitle:
                        'Turn a channel off to stop receiving its emails.',
                      title: 'Channels',
                    },
                  ]
                : []),
              ...(selectedOrg
                ? [
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
                      title: `Block all mass emails from ${selectedOrg?.label}`,
                    },
                  ]
                : []),
            ]}
            title={`Email settings`}
          />
        </Stack>
      )}
    </Suspense>
  );
};

export default SettingsPage;
