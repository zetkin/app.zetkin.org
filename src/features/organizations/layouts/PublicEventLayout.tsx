'use client';

import { Box } from '@mui/system';
import { FC, PropsWithChildren } from 'react';
import NextLink from 'next/link';

import ActivistPortalHeader from '../components/ActivistPortlHeader';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import useIsMobile from 'utils/hooks/useIsMobile';
import useEvent from 'features/events/hooks/useEvent';
import { removeOffset } from 'utils/dateUtils';

type Props = PropsWithChildren<{
  eventId: number;
  orgId: number;
}>;

export const PublicEventLayout: FC<Props> = ({ children, eventId, orgId }) => {
  const messages = useMessages(messageIds);
  const isMobile = useIsMobile();

  const eventFuture = useEvent(orgId, eventId);
  const event = eventFuture?.data;

  return (
    <Box
      sx={{
        minHeight: '100dvh',
      }}
    >
      {event && (
        <Box
          sx={{
            marginX: 'auto',
            maxWidth: 960,
          }}
        >
          <Box bgcolor="white">
            <ActivistPortalHeader
              subtitle={
                <Box
                  sx={{
                    alignItems: isMobile ? 'flex-start' : 'center',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 1,
                  }}
                >
                  <ZUIText>
                    <ZUITimeSpan
                      end={new Date(removeOffset(event.end_time))}
                      start={new Date(removeOffset(event.start_time))}
                    />
                  </ZUIText>
                  <ZUIText variant="bodySmRegular">
                    {event.location?.title || (
                      <Msg id={messageIds.eventPage.noLocation} />
                    )}
                  </ZUIText>
                </Box>
              }
              title={
                event.title ||
                event.activity?.title ||
                messages.eventPage.defaultTitle()
              }
              topLeftComponent={
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                    gap: 1,
                    justifyContent: 'center',
                  }}
                >
                  <ZUIOrgLogoAvatar
                    orgId={event.organization.id}
                    size="small"
                  />
                  <ZUILink
                    hoverUnderline={true}
                    href={`/o/${event.organization.id}`}
                    text={event.organization.title}
                  />
                </Box>
              }
            />
          </Box>
          {children}
        </Box>
      )}
    </Box>
  );
};
export default PublicEventLayout;
