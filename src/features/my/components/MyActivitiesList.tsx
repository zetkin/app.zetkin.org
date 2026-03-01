'use client';

import { FC, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { GroupWorkOutlined, Hotel } from '@mui/icons-material';

import { Msg, useMessages } from 'core/i18n';
import MyActivityListItem from 'features/my/components/MyActivityListItem';
import useMyActivities from 'features/my/hooks/useMyActivities';
import messageIds from 'features/public/l10n/messageIds';
import EventListItem from 'features/public/components/EventListItem';
import useIncrementalDelay from 'features/public/hooks/useIncrementalDelay';
import { MyActivity } from 'features/public/types';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUIFilterButton from 'zui/components/ZUIFilterButton';
import AreaAssignmentListItem from 'features/public/components/AreaAssignmentListItem';

const MyActivitiesList: FC = () => {
  const activities = useMyActivities();
  const messages = useMessages(messageIds);
  type KindOfActivity = MyActivity['kind'];

  const [filteredKinds, setFilteredKinds] = useState<KindOfActivity[]>([]);
  const nextDelay = useIncrementalDelay();

  const kinds = Array.from(
    new Set(activities.map((activity) => activity.kind))
  ) as KindOfActivity[];

  const filteredActivities = activities.filter((activity) => {
    const notFiltering = filteredKinds.length == 0;
    return notFiltering || filteredKinds.includes(activity.kind);
  });

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {kinds.length > 1 && (
        <Box display="flex" gap={1}>
          <ZUIFilterButton
            active={filteredKinds.length === 0}
            label={messages.activityList.filters.allActivities()}
            onClick={() => setFilteredKinds([])}
          />
          {kinds.map((kind) => {
            const active = filteredKinds.includes(kind);
            return (
              <ZUIFilterButton
                key={kind}
                active={active}
                label={messages.activityList.filters[kind]()}
                onClick={() => {
                  setFilteredKinds([kind]);
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
              info={[
                {
                  Icon: GroupWorkOutlined,
                  labels: activity.data.campaign
                    ? [
                        activity.data.campaign.title,
                        activity.data.organization.title,
                      ]
                    : [activity.data.organization.title],
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
            <AreaAssignmentListItem assignment={activity.data} href={href} />
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
