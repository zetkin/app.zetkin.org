'use client';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { NorthWest } from '@mui/icons-material';
import NextLink from 'next/link';

import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinOrganization } from 'utils/types/zetkin';
import useFilteredOrgEvents from '../hooks/useFilteredOrgEvents';
import ActivistPortalHeader from '../components/ActivistPortlHeader';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import FollowUnfollowLoginButton from '../components/ActivistPortlHeader/FollowUnfollowLoginButton';
import EventMapLayout from './EventMapLayout';
import usePublicSubOrgs from '../hooks/usePublicSubOrgs';

type Props = {
  children: ReactNode;
  org: ZetkinOrganization;
};

const PublicOrgLayout: FC<Props> = ({ children, org }) => {
  const messages = useMessages(messageIds);
  const subOrgs = usePublicSubOrgs(org.id);
  const { filteredEvents } = useFilteredOrgEvents(org.id);
  const path = usePathname();

  const lastSegment = path?.split('/')[3] ?? 'home';
  const showSuborgsTab = lastSegment == 'suborgs' || subOrgs.length > 0;

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
    <EventMapLayout
      events={filteredEvents}
      header={
        <ActivistPortalHeader
          button={<FollowUnfollowLoginButton orgId={org.id} />}
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
      }
    >
      {children}
    </EventMapLayout>
  );
};

export default PublicOrgLayout;
