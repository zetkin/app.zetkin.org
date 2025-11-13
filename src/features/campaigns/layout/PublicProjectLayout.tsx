'use client';

import { Box } from '@mui/material';
import { FC, ReactNode, useContext } from 'react';
import { CalendarMonth } from '@mui/icons-material';

import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import useFilteredCampaignEvents from 'features/campaigns/hooks/useFilteredCampaignEvents';
import ActivistPortalHeader from 'features/organizations/components/ActivistPortalHeader';
import EventMapLayout from 'features/organizations/layouts/EventMapLayout';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated } from '../store';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUILink from 'zui/components/ZUILink';

type Props = {
  campaign: ZetkinCampaign;
  children: ReactNode;
};

const PublicProjectLayout: FC<Props> = ({ children, campaign }) => {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const { allEvents, filteredEvents } = useFilteredCampaignEvents(
    campaign.organization.id,
    campaign.id
  );

  const { geojsonToFilterBy } = useAppSelector(
    (state) => state.campaigns.filters
  );

  const setLocationFilter = (geojsonToFilterBy: GeoJSON.Feature[]) => {
    dispatch(
      filtersUpdated({
        geojsonToFilterBy,
      })
    );
  };
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
      events={filteredEvents}
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
            <Box sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
              <ZUIOrgLogoAvatar orgId={campaign.organization.id} size="small" />
              <ZUILink
                hoverUnderline={true}
                href={`/o/${campaign.organization.id}`}
                text={campaign.organization.title}
              />
            </Box>
          }
        />
      }
      locationFilter={geojsonToFilterBy}
      setLocationFilter={setLocationFilter}
      showMap={allEvents.length > 0}
    >
      {children}
    </EventMapLayout>
  );
};

export default PublicProjectLayout;
