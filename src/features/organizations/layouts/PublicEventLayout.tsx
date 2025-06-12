'use client';

import { Box } from '@mui/system';
import { FC, PropsWithChildren } from 'react';
import NextLink from 'next/link';

import useEvent from 'features/events/hooks/useEvent';
import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import ActivistPortalHeader from '../components/ActivistPortlHeader';
import ZUILink from 'zui/components/ZUILink';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';

type Props = PropsWithChildren<{
  eventId: number;
  org: ZetkinOrganization;
}>;

export const PublicEventLayout: FC<Props> = ({ children, eventId, org }) => {
  const event = useEvent(org.id, eventId)?.data;

  if (!event) {
    return null;
  }

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
        title={event.title || 'WHAT IF EVENT HAS NO TITLE??'}
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
