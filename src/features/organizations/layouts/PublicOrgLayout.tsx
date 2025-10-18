'use client';

import { Box } from '@mui/material';
import { FC, ReactNode, useCallback, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  CalendarMonth,
  Email,
  NorthWest,
  Phone,
  Public,
} from '@mui/icons-material';
import NextLink from 'next/link';
import { useIntl } from 'react-intl';

import { Msg, useMessages } from 'core/i18n';
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
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { filtersUpdated } from '../store';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUILink from 'zui/components/ZUILink';

type Props = {
  children: ReactNode;
  org: ZetkinOrganization;
};

const PublicOrgLayout: FC<Props> = ({ children, org }) => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const messages = useMessages(messageIds);
  const subOrgs = usePublicSubOrgs(org.id);
  const { filteredEvents } = useFilteredOrgEvents(org.id);
  const path = usePathname();

  const { locale } = useIntl();
  const regionNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: 'region' }),
    [locale]
  );

  const getCountryName = useCallback(
    (code: string) => {
      try {
        const regionName = regionNames.of(code);
        return regionName ?? code;
      } catch (_) {
        return code;
      }
    },
    [regionNames]
  );

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

  const { geojsonToFilterBy } = useAppSelector(
    (state) => state.organizations.filters
  );

  const setLocationFilter = (geojsonToFilterBy: GeoJSON.Feature[]) => {
    dispatch(
      filtersUpdated({
        geojsonToFilterBy,
      })
    );
  };

  return (
    <EventMapLayout
      events={filteredEvents}
      header={
        <ActivistPortalHeader
          button={
            <>
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
            </>
          }
          selectedTab={lastSegment}
          subtitle={
            <Box>
              {org.email ? (
                <ZUIIconLabel
                  color={'secondary'}
                  icon={
                    <Email
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        fontSize: '1em',
                      })}
                    />
                  }
                  label={
                    <ZUILink
                      hoverUnderline={true}
                      href={`mailto:${org.email}`}
                      text={org.email}
                      variant={'secondary'}
                    />
                  }
                  size={'sm'}
                />
              ) : null}
              {org.phone ? (
                <ZUIIconLabel
                  color={'secondary'}
                  icon={
                    <Phone
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        fontSize: '1em',
                      })}
                    />
                  }
                  label={
                    <ZUILink
                      hoverUnderline={true}
                      href={`tel:${org.phone}`}
                      text={org.phone}
                      variant={'secondary'}
                    />
                  }
                  size={'sm'}
                />
              ) : null}
              {org.country ? (
                <ZUIIconLabel
                  color={'secondary'}
                  icon={
                    <Public
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        fontSize: '1em',
                      })}
                    />
                  }
                  label={getCountryName(org.country)}
                  size={'sm'}
                />
              ) : null}
            </Box>
          }
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
      locationFilter={geojsonToFilterBy}
      setLocationFilter={setLocationFilter}
      showMap={true}
    >
      {children}
    </EventMapLayout>
  );
};

export default PublicOrgLayout;
