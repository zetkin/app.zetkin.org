'use client';

import { Box, Button, NoSsr, SxProps } from '@mui/material';
import { FC, ReactNode, Suspense, useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/system';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';

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
  header: JSX.Element;
  renderMap: () => JSX.Element;
  showMap: boolean;
};

const EventMapLayout: FC<Props> = ({
  children,
  header,
  renderMap,
  showMap,
}) => {
  const [mobileMapVisible, setMobileMapVisible] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const showMapMobile = isMobile && showMap;
  const showMapDesktop = !isMobile && showMap;
  const shouldMountMap = useDelayOnTrue(transitionDuration, showMapDesktop);

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
            <Box display="flex" flexDirection="column">
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
            <>
              <Box
                sx={{
                  height: '100%',
                }}
              >
                <NoSsr>{renderMap()}</NoSsr>
              </Box>
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
            </>
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
              <Box
                sx={{
                  height: '100dvh',
                  position: 'sticky',
                  top: 0,
                  width: '100%',
                }}
              >
                <NoSsr>{renderMap()}</NoSsr>
              </Box>
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
