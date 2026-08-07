'use client';

import { Box, NoSsr } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import NextLink from 'next/link';
import { CalendarMonth } from '@mui/icons-material';

import { ZetkinProject } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ActivistPortalHeader from 'features/public/components/ActivistPortalHeader';
import EventMapLayout from 'features/public/layouts/EventMapLayout';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/projects/l10n/messageIds';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ActivistPortalProjectEventsMap from 'features/organizations/components/ActivistPortalProjectEventsMap';

type Props = {
  children: ReactNode;
  project: ZetkinProject;
};

const PublicProjectLayout: FC<Props> = ({ children, project }) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  function copyUrlToClipboard() {
    const url = `${location.protocol}//${location.host}/o/${project.organization.id}/projects/${project.id}/events.ics`;
    navigator.clipboard.writeText(url);
    showSnackbar(
      'success',
      <Msg id={messageIds.publicProjectPage.calendarLinkCopied} />
    );
  }

  return (
    <EventMapLayout
      header={
        <ActivistPortalHeader
          button={
            <ZUIEllipsisMenu
              items={[
                {
                  id: 'copy-ics-url',
                  label: messages.publicProjectPage.copyIcsUrl(),
                  onSelect: () => copyUrlToClipboard(),
                  startIcon: <CalendarMonth />,
                },
              ]}
            />
          }
          subtitle={project.info_text}
          title={project.title}
          topLeftComponent={
            <NextLink href={`/o/${project.organization.id}`} passHref>
              <Box
                sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              >
                <ZUIOrgLogoAvatar
                  orgId={project.organization.id}
                  size="small"
                />
                <ZUIText>{project.organization.title}</ZUIText>
              </Box>
            </NextLink>
          }
        />
      }
      renderMap={() => (
        <ActivistPortalProjectEventsMap
          orgId={project.organization.id}
          projectId={project.id}
        />
      )}
      showMap={true}
    >
      <NoSsr>{children}</NoSsr>
    </EventMapLayout>
  );
};

export default PublicProjectLayout;
