'use client';

import { FC, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { GroupWorkOutlined, Hotel } from '@mui/icons-material';

import useMyActivities from '../hooks/useMyActivities';
import MyActivityListItem from './MyActivityListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import EventListItem from './EventListItem';
import useIncrementalDelay from '../hooks/useIncrementalDelay';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';

const MyActivitiesList: FC = () => {
  const activities = useMyActivities();
  const messages = useMessages(messageIds);
  const [filteredKinds, setFilteredKinds] = useState<string[]>([]);
  const nextDelay = useIncrementalDelay();

  const kinds = Array.from(
    new Set(activities.map((activity) => activity.kind))
  );

  const filteredActivities = activities.filter((activity) => {
    const notFiltering = filteredKinds.length == 0;
    return notFiltering || filteredKinds.includes(activity.kind);
  });

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {kinds.length > 1 && (
        <Box display="flex" gap={1}>
          {kinds.map((kind) => {
            const active = filteredKinds.includes(kind);
            return (
              <ZUIFilterButton
                key={kind}
                active={active}
                label={messages.activityList.filters[kind]()}
                onClick={() => {
                  const newValue = filteredKinds.filter(
                    (prevKind) => prevKind != kind
                  );

                  if (!active) {
                    newValue.push(kind);
                  }

                  setFilteredKinds(newValue);
                }}
              />
            );
          })}
        </Box>
      )}
      {filteredActivities.length == 0 && (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={1}
          justifyContent="center"
          marginTop={3}
          padding={2}
        >
          <ZUIText color="secondary">
            <Msg id={messageIds.activityList.emptyListMessage} />
          </ZUIText>
          <Hotel color="secondary" fontSize="large" />
        </Box>
      )}
      {filteredActivities.map((activity) => {
        let elem, href;

        if (activity.kind == 'call') {
          href = `/call/${activity.data.id}`;
          elem = (
            <MyActivityListItem
              actions={[
                <ZUIButton
                  key="mainAction"
                  href={href}
                  label={messages.activityList.actions.call()}
                  size="large"
                  variant="secondary"
                />,
              ]}
              description={activity.data.description}
              href={href}
              info={[
                {
                  Icon: GroupWorkOutlined,
                  labels: [
                    activity.data.campaign && {
                      href: `/o/${activity.data.organization.id}/projects/${activity.data.campaign.id}`,
                      text: activity.data.campaign.title,
                    },
                    {
                      href: `/o/${activity.data.organization.id}/`,
                      text: activity.data.organization.title,
                    },
                  ].filter((label) => !!label) as string[],
                },
              ]}
              title={
                activity.data.title || messages.defaultTitles.callAssignment()
              }
            />
          );
        } else if (activity.kind == 'canvass') {
          href = `/canvass/${activity.data.id}`;
          elem = (
            <MyActivityListItem
              actions={[
                <ZUIButton
                  key="mainAction"
                  href={href}
                  label={messages.activityList.actions.areaAssignment()}
                  size="large"
                  variant="secondary"
                />,
              ]}
              description={activity.data.instructions}
              info={[
                {
                  Icon: GroupWorkOutlined,
                  labels: [
                    {
                      href: `/o/${activity.data.organization_id}/projects/${activity.data.project_id}`,
                      text: `<${activity.data.project_id}>`,
                    },
                    {
                      href: `/o/${activity.data.organization_id}/`,
                      text: `<${activity.data.organization_id}>`,
                    },
                  ],
                },
              ]}
              title={
                activity.data.title || messages.defaultTitles.areaAssignment()
              }
            />
          );
        } else if (activity.kind == 'event') {
          href = `/o/${activity.data.organization.id}/events/${activity.data.id}`;
          elem = <EventListItem event={activity.data} href={href} />;
        }

        return (
          <Fade key={href} appear in style={{ transitionDelay: nextDelay() }}>
            <Box>{elem}</Box>
          </Fade>
        );
      })}
    </Box>
  );
};

export default MyActivitiesList;
