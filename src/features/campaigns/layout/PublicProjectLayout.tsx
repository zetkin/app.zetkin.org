'use client';

import { Box, NoSsr } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import NextLink from 'next/link';
import { CalendarMonth } from '@mui/icons-material';

import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ActivistPortalHeader from 'features/organizations/components/ActivistPortalHeader';
import EventMapLayout from 'features/organizations/layouts/EventMapLayout';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ActivistPortalCampaignEventsMap from 'features/organizations/components/ActivistPortalCampaignEventsMap';

type Props = {
  campaign: ZetkinCampaign;
  children: ReactNode;
};

const PublicProjectLayout: FC<Props> = ({ children, campaign }) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  function copyUrlToClipboard() {
    const url = `${location.protocol}//${location.host}/o/${campaign.organization.id}/projects/${campaign.id}/events.ics`;
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
          subtitle={campaign.info_text}
          title={campaign.title}
          topLeftComponent={
            <NextLink href={`/o/${campaign.organization.id}`} passHref>
              <Box
                sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              >
                <ZUIOrgLogoAvatar
                  orgId={campaign.organization.id}
                  size="small"
                />
                <ZUIText>{campaign.organization.title}</ZUIText>
              </Box>
            </NextLink>
          }
        />
      }
      renderMap={() => (
        <ActivistPortalCampaignEventsMap
          campId={campaign.id}
          orgId={campaign.organization.id}
        />
      )}
      showMap={true}
    >
      <NoSsr>{children}</NoSsr>
    </EventMapLayout>
  );
};

export default PublicProjectLayout;
