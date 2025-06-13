'use client';

import { Box } from '@mui/system';
import { FC, PropsWithChildren } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';

import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import ActivistPortalHeader from '../components/ActivistPortlHeader';
import ZUILink from 'zui/components/ZUILink';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinEvent } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import ZUIGradientBackground from 'zui/components/ZUIGradientBackground';
import useIsMobile from 'utils/hooks/useIsMobile';

type Props = PropsWithChildren<{
  event: ZetkinEvent;
}>;

export const PublicEventLayout: FC<Props> = ({ children, event }) => {
  const messages = useMessages(messageIds);
  const isMobile = useIsMobile();

  return (
    <Box
      sx={{
        minHeight: '100dvh',
      }}
    >
      <Box
        sx={{
          height: '100%',
          position: 'fixed',
          width: '100%',
          zIndex: -1,
        }}
      >
        <ZUIGradientBackground seed={`${event.id}event`} />
      </Box>
      <Box
        sx={{
          //marginX: isMobile ? 2 : '',
          marginX: 'auto',
          maxWidth: 960,
          paddingBottom: 4,
          position: 'relative',
        }}
      >
        <Box paddingTop={!isMobile ? 4 : ''}>
          <Box bgcolor="white">
            <ActivistPortalHeader
              subtitle={
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  <ZUIText>
                    <ZUITimeSpan
                      end={new Date(event.end_time)}
                      start={new Date(event.start_time)}
                    />
                    {', '}
                  </ZUIText>
                  {event.campaign && (
                    <ZUILink
                      href={`/o/${event.organization.id}/projects/${event.campaign.id}`}
                      text={event.campaign.title}
                    />
                  )}
                </Box>
              }
              title={
                event.title ||
                event.activity?.title ||
                messages.eventPage.defaultTitle()
              }
              topLeftComponent={
                <NextLink href={`/o/${event.organization.id}`} passHref>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'inline-flex',
                      gap: 1,
                    }}
                  >
                    <ZUIOrgLogoAvatar
                      orgId={event.organization.id}
                      size="small"
                    />
                    <ZUIText>{event.organization.title}</ZUIText>
                  </Box>
                </NextLink>
              }
            />
          </Box>
        </Box>
        {event.cover_file && (
          <Box
            sx={{
              '& img': {
                '-webkit-mask-image': !isMobile
                  ? 'linear-gradient(black 70%, transparent 100%)'
                  : '',
                'mask-image': !isMobile
                  ? ' linear-gradient(black 70%, transparent 100%)'
                  : '',
              },
              height: isMobile ? 200 : 450,
              marginY: isMobile ? 2 : '',
              maxWidth: 960,
              paddingX: isMobile ? 2 : '',
            }}
          >
            <Image
              alt=""
              height={480}
              src={event.cover_file.url}
              style={{
                height: '100%',
                objectFit: 'cover',
                width: '100%',
              }}
              width={960}
            />
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            justifyContent: 'center',
            marginTop: event.cover_file ? '' : 4,
            paddingX: () => {
              if (isMobile) {
                return 2;
              }

              if (event.cover_file) {
                return 4;
              }

              return '';
            },
            position: event.cover_file && !isMobile ? 'absolute' : '',
            top: isMobile ? 200 : 300,
          }}
        >
          {children}
          <Box bgcolor="white" borderRadius={2}>
            <ZUIPublicFooter />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default PublicEventLayout;
