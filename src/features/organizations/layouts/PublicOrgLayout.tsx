'use client';

import { Box, Button, SxProps } from '@mui/material';
import { FC, ReactNode, Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMediaQuery, useTheme } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { NorthWest } from '@mui/icons-material';
import NextLink from 'next/link';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import usePublicSubOrgs from '../hooks/usePublicSubOrgs';
import { OrgPageMap } from '../components/PublicOrgPageMap';
import useFilteredOrgEvents from '../hooks/useFilteredOrgEvents';
import ActivistPortalHeader from '../components/ActivistPortlHeader';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';

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

const PublicOrgLayout: FC<Props> = ({ children, org }) => {
  const messages = useMessages(messageIds);
  const [mobileMapVisible, setMobileMapVisible] = useState(false);

  const subOrgs = usePublicSubOrgs(org.id);

  const path = usePathname();
  const lastSegment = path?.split('/')[3] ?? 'home';
  const showSuborgsTab = lastSegment == 'suborgs' || subOrgs.length > 0;

  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { filteredEvents } = useFilteredOrgEvents(org.id);

  const showMap = lastSegment != 'suborgs' && filteredEvents.length > 0;
  const showMapDesktop = !isMobile && showMap;
  const shouldMountMap = useDelayOnTrue(transitionDuration, showMapDesktop);
  const showMapMobile = isMobile && showMap;

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
        maxWidth: showMapDesktop ? '100%' : 960,
        minHeight: '100dvh',
        ...transitionSettings,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        flexShrink={0}
        sx={{
          maxWidth: showMapDesktop ? 480 : 960,
          width: '100%',
          ...transitionSettings,
        }}
      >
        <ActivistPortalHeader
          orgId={org.id}
          selectedTab={lastSegment}
          tabs={navBarItems}
          title={
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <ZUIOrgLogoAvatar orgId={org.id} />
              <ZUIText variant="headingLg">{org.title}</ZUIText>
            </Box>
          }
          topLeftComponent={
            org.parent ? (
              <NextLink href={`/o/${org.parent.id}`} passHref>
                <ZUIButton
                  label={org.parent.title}
                  size="small"
                  startIcon={NorthWest}
                />
              </NextLink>
            ) : undefined
          }
        />
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
          {!showMapMobile || !mobileMapVisible ? (
            <Box display="flex" flexDirection="column" minHeight="90dvh">
              {children}
              {showMapMobile && (
                <Box
                  className={classes.actionAreaContainer}
                  sx={{ position: 'sticky' }}
                >
                  <Button
                    onClick={() => setMobileMapVisible(true)}
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
              events={filteredEvents}
              sx={{
                height: '100%',
              }}
            >
              <Box
                className={classes.actionAreaContainer}
                sx={{ position: 'fixed' }}
              >
                <Button
                  onClick={() => setMobileMapVisible(false)}
                  sx={{ background: 'white' }}
                  variant="outlined"
                >
                  <Msg id={messageIds.home.map.viewInList} />
                </Button>
              </Box>
            </OrgPageMap>
          )}
        </Suspense>
        {!showMapMobile && mobileMapVisible && <ZUIPublicFooter />}
      </Box>
      {!isMobile && (
        <Suspense>
          <Box
            sx={{
              [theme.breakpoints.down('md')]: {
                display: 'none',
              },
              flexGrow: 1,
              maxWidth: showMapDesktop ? '100%' : '0px',
              position: 'relative',
              width: showMapDesktop ? '100%' : '0px',
              ...transitionSettings,
            }}
          >
            {shouldMountMap ? (
              <OrgPageMap
                events={filteredEvents}
                sx={{
                  height: '100dvh',
                  position: 'sticky',
                  top: 0,
                  width: '100%',
                }}
              />
            ) : showMapDesktop ? (
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

export default PublicOrgLayout;
