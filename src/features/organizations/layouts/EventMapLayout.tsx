'use client';

import { Box, Button, SxProps } from '@mui/material';
import { FC, ReactNode, Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMediaQuery, useTheme } from '@mui/system';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import { ActivistPortalEventMap } from '../components/ActivistPortalEventMap';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
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

type Props = {
  children: ReactNode;
  events: ZetkinEventWithStatus[];
  header: JSX.Element;
};

const EventMapLayout: FC<Props> = ({ children, events, header }) => {
  const [mobileMapVisible, setMobileMapVisible] = useState(false);

  const path = usePathname();
  const lastSegment = path?.split('/')[3] ?? 'home';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const showMap = lastSegment != 'suborgs' && events.length > 0;
  const showMapDesktop = !isMobile && showMap;
  const shouldMountMap = useDelayOnTrue(transitionDuration, showMapDesktop);
  const showMapMobile = isMobile && showMap;

  return (
    <Box
      display="flex"
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
        {header}
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
                  sx={{
                    bottom: 15,
                    display: 'flex',
                    gap: 8,
                    justifyContent: 'center',
                    padding: 8,
                    position: 'sticky',
                    width: '100%',
                    zIndex: 1000,
                  }}
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
            <ActivistPortalEventMap
              events={events}
              sx={{
                height: '100%',
              }}
            >
              <Box
                sx={{
                  bottom: 15,
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'center',
                  padding: 8,
                  position: 'fixed',
                  width: '100%',
                  zIndex: 1000,
                }}
              >
                <Button
                  onClick={() => setMobileMapVisible(false)}
                  sx={{ background: 'white' }}
                  variant="outlined"
                >
                  <Msg id={messageIds.home.map.viewInList} />
                </Button>
              </Box>
            </ActivistPortalEventMap>
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
              <ActivistPortalEventMap
                events={events}
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

export default EventMapLayout;
