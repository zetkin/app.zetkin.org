'use client';

import { Box } from '@mui/system';
import { FC, PropsWithChildren } from 'react';
import NextLink from 'next/link';

import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import ActivistPortalHeader from '../components/ActivistPortlHeader';
import ZUILink from 'zui/components/ZUILink';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinEvent } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = PropsWithChildren<{
  event: ZetkinEvent;
}>;

export const PublicEventLayout: FC<Props> = ({ children, event }) => {
  const messages = useMessages(messageIds);
  return (
    <Box sx={{ marginX: 'auto', maxWidth: 960 }}>
      <ActivistPortalHeader
        imageUrl={event.cover_file?.url}
        subtitle={
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            {event.campaign && (
              <ZUILink
                href={`/o/${event.organization.id}/projects/${event.campaign.id}`}
                text={event.campaign.title}
              />
            )}
            {event.activity && <ZUIText>{event.activity.title}</ZUIText>}
          </Box>
        }
        title={
          event.title ||
          event.activity?.title ||
          messages.eventPage.defaultTitle()
        }
        topLeftComponent={
          <NextLink href={`/o/${event.organization.id}`} passHref>
            <Box sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
              <ZUIOrgLogoAvatar orgId={event.organization.id} size="small" />
              <ZUIText>{event.organization.title}</ZUIText>
            </Box>
          </NextLink>
        }
      />
      {children}
      <ZUIPublicFooter />
    </Box>
  );
};
export default PublicEventLayout;
