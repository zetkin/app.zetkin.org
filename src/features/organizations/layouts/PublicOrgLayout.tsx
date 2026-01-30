'use client';

import { Box, NoSsr } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarMonth, NorthWest } from '@mui/icons-material';
import NextLink from 'next/link';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinOrganization } from 'utils/types/zetkin';
import ActivistPortalHeader from 'features/organizations/components/ActivistPortalHeader';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import FollowUnfollowLoginButton from '../components/ActivistPortalHeader/FollowUnfollowLoginButton';
import EventMapLayout from './EventMapLayout';
import usePublicSubOrgs from '../hooks/usePublicSubOrgs';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ActivistPortalOrgEventsMap from '../components/ActivistPortalOrgEventsMap';

type Props = {
  children: ReactNode;
  org: ZetkinOrganization;
};

const PublicOrgLayout: FC<Props> = ({ children, org }) => {
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const messages = useMessages(messageIds);
  const subOrgs = usePublicSubOrgs(org.id);
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

  function copyUrlToClipboard() {
    const url = `${location.protocol}//${location.host}/o/${org.id}/events.ics`;
    navigator.clipboard.writeText(url);
    showSnackbar(
      'success',
      <Msg id={messageIds.home.header.calendarLinkCopied} />
    );
  }

  return (
    <EventMapLayout
      header={
        <ActivistPortalHeader
          button={
            <Box>
              {org.is_open ? (
                <FollowUnfollowLoginButton orgId={org.id} />
              ) : undefined}
              <ZUIEllipsisMenu
                items={[
                  {
                    id: 'copy-ics-url',
                    label: messages.home.header.copyIcsUrl(),
                    onSelect: () => copyUrlToClipboard(),
                    startIcon: <CalendarMonth />,
                  },
                ]}
              />
            </Box>
          }
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
      renderMap={() => <ActivistPortalOrgEventsMap orgId={org.id} />}
      showMap={true}
    >
      <NoSsr>{children}</NoSsr>
    </EventMapLayout>
  );
};

export default PublicOrgLayout;
