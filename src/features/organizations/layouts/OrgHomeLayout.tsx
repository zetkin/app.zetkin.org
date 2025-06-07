'use client';

import { Box, Button, SxProps } from '@mui/material';
import { FC, ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { NorthWest } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/system';
import { makeStyles } from '@mui/styles';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useUser from 'core/hooks/useUser';
import ZUILogo from 'zui/ZUILogo';
import { useEnv } from 'core/hooks';
import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIButton from 'zui/components/ZUIButton';
import ZUITabbedNavBar from 'zui/components/ZUITabbedNavBar';
import ZUIOldAvatar from 'zui/ZUIAvatar';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUILink from 'zui/components/ZUILink';
import usePublicSubOrgs from '../hooks/usePublicSubOrgs';
import useMembership from '../hooks/useMembership';
import useFollowOrgMutations from '../hooks/useFollowOrgMutations';
import useConnectOrg from '../hooks/useConnectOrg';
import { OrgPageMap } from '../pages/PublicOrgPage';
import useUpcomingOrgEvents from '../hooks/useUpcomingOrgEvents';
import { ZetkinEventWithStatus } from 'features/home/types';

const useDelayOnTrue = (durationMs: number, value: boolean) => {
  const [delayedValue, setDelayedValue] = useState(false);

  useEffect(() => {
    if (value) {
      const timer = setTimeout(() => setDelayedValue(value), durationMs);
      return () => clearTimeout(timer);
    } else {
      setDelayedValue(value);
    }
  }, [durationMs, value]);

  return value && delayedValue;
};

const transitionDuration = 500; // ms
const transitionSettings: SxProps = {
  transitionDuration: `${transitionDuration}ms`,
  transitionProperty: 'width, max-width',
  transitionTimingFunction: 'ease-in-out',
};

const useStyles = makeStyles(() => ({
  actionAreaContainer: {
    bottom: 15,
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
    width: '100%',
    zIndex: 1000,
  },
}));

type Props = {
  children: ReactNode;
  org: ZetkinOrganization;
};

const OrgHomeLayout: FC<Props> = ({ children, org }) => {
  const messages = useMessages(messageIds);
  const env = useEnv();
  const [showMapMobile, setShowMapMobile] = useState(false);

  const subOrgs = usePublicSubOrgs(org.id);

  const path = usePathname();
  const lastSegment = path?.split('/')[3] ?? 'home';
  const showSuborgsTab = lastSegment == 'suborgs' || subOrgs.length > 0;

  const user = useUser();
  const membership = useMembership(org.id).data;

  const { followOrg, unfollowOrg } = useFollowOrgMutations(org.id);
  const { connectOrg } = useConnectOrg(org.id);

  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const orgEvents = useUpcomingOrgEvents(org.id);
  const allEvents = useMemo(() => {
    return orgEvents.map<ZetkinEventWithStatus>((event) => ({
      ...event,
      status: null,
    }));
  }, [orgEvents]);

  const showMap = !isMobile && lastSegment != 'suborgs' && allEvents.length > 0;
  const shouldMountMap = useDelayOnTrue(transitionDuration, showMap);

  const navBarItems = [
    {
      href: `/o/${org.id}`,
      label: messages.home.tabs.calendar(),
      value: 'home',
    },
  ];

  if (showSuborgsTab) {
    navBarItems.push({
      href: `/o/${org.id}/suborgs`,
      label: messages.home.tabs.suborgs(),
      value: 'suborgs',
    });
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{
        marginX: 'auto',
        maxWidth: showMap ? '100%' : 960,
        minHeight: '100dvh',
        ...transitionSettings,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        sx={{
          maxWidth: showMap ? 480 : 960,
          ...transitionSettings,
        }}
      >
        <Box
          sx={(theme) => ({
            bgcolor: theme.palette.grey[100],
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <Box sx={{ mb: 6, minHeight: 40, mt: 2, mx: 2, opacity: 0.7 }}>
            {org.parent && (
              <NextLink href={`/o/${org.parent.id}`} passHref>
                <ZUIButton label={org.parent.title} startIcon={NorthWest} />
              </NextLink>
            )}
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              mx: 2,
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <ZUIOldAvatar size="md" url={`/api/orgs/${org.id}/avatar`} />
              <ZUIText variant="headingLg">{org.title}</ZUIText>
              {user && membership?.follow && (
                <ZUIButton
                  label={messages.home.header.unfollow()}
                  onClick={() => unfollowOrg()}
                />
              )}
              {user && membership?.follow === false && (
                <ZUIButton
                  label={messages.home.header.follow()}
                  onClick={() => followOrg(membership)}
                />
              )}
              {user && !membership && (
                <ZUIButton
                  label={messages.home.header.connect()}
                  onClick={() => connectOrg()}
                />
              )}
              {!user && (
                <ZUIButton
                  href={`/login?redirect=${encodeURIComponent(`/o/${org.id}`)}`}
                  label={messages.home.header.login()}
                />
              )}
            </Box>
            {user && (
              <NextLink href="/my">
                <ZUIPersonAvatar
                  firstName={user.first_name}
                  id={user.id}
                  lastName={user.last_name}
                />
              </NextLink>
            )}
          </Box>
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <ZUITabbedNavBar items={navBarItems} selectedTab={lastSegment} />
          </Box>
        </Box>
        <Suspense
          fallback={
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              height="90dvh"
              justifyContent="center"
            >
              <ZUILogoLoadingIndicator />
            </Box>
          }
        >
          {!showMapMobile ? (
            <Box display="flex" flexDirection="column" minHeight="90dvh">
              {children}
              {isMobile && (
                <Box className={classes.actionAreaContainer} sx={{ position: 'sticky' }}>
                  <Button
                    onClick={() => setShowMapMobile(true)}
                    sx={{ background: 'white' }}
                    variant="outlined"
                  >
                    <Msg id={messageIds.home.map.viewInMap} />
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <OrgPageMap
              events={allEvents}
              sx={{
                height: '100%',
              }}
            >
              <Box className={classes.actionAreaContainer} sx={{ position: 'fixed' }}>
                <Button
                  onClick={() => setShowMapMobile(false)}
                  sx={{ background: 'white' }}
                  variant="outlined"
                >
                  <Msg id={messageIds.home.map.viewInList} />
                </Button>
              </Box>
            </OrgPageMap>
          )}
        </Suspense>
        {!showMapMobile && (
          <Box
            alignItems="center"
            component="footer"
            display="flex"
            flexDirection="column"
            mx={1}
            my={2}
            sx={{ opacity: 0.75 }}
          >
            <ZUILogo />
            <ZUIText variant="bodySmRegular">Zetkin</ZUIText>
            <ZUILink
              href={
                env.vars.ZETKIN_PRIVACY_POLICY_LINK ||
                'https://www.zetkin.org/privacy'
              }
              size="small"
              text={messages.home.footer.privacyPolicy()}
            />
          </Box>
        )}
      </Box>
      {!isMobile && (
        <Suspense>
          <Box
            sx={{
              [theme.breakpoints.down('md')]: {
                display: "none",
              },
              flexGrow: 1,
              maxWidth: showMap ? '100%' : '0px',
              position: 'relative',
              width: showMap ? '100%' : '0px',
              ...transitionSettings,
            }}
          >
            {shouldMountMap ? (
              <OrgPageMap
                events={allEvents}
                sx={{
                  height: '100dvh',
                  position: 'sticky',
                  top: 0,
                  width: '100%',
                }}
              />
            ) : showMap ? (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                sx={{
                  height: '100dvh',
                  position: 'sticky',
                  top: 0,
                  width: '100%',
                }}
              >
                <ZUILogoLoadingIndicator />
              </Box>
            ) : null}
          </Box>
        </Suspense>
      )}
    </Box>
  );
};

export default OrgHomeLayout;
