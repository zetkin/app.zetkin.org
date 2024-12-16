'use client';

import { FC, useState } from 'react';
import { Box, Button, Fade, Typography } from '@mui/material';
import {
  GroupWorkOutlined,
  Hotel,
  MapsHomeWork,
  PhoneInTalk,
} from '@mui/icons-material';

import useMyActivities from '../hooks/useMyActivities';
import MyActivityListItem from './MyActivityListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import EventListItem from './EventListItem';
import useIncrementalDelay from '../hooks/useIncrementalDelay';
import FilterButton from './FilterButton';

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
              <FilterButton
                key={kind}
                active={active}
                onClick={() => {
                  const newValue = filteredKinds.filter(
                    (prevKind) => prevKind != kind
                  );

                  if (!active) {
                    newValue.push(kind);
                  }

                  setFilteredKinds(newValue);
                }}
              >
                <Msg id={messageIds.activityList.filters[kind]} />
              </FilterButton>
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
          <Typography color="secondary">
            <Msg id={messageIds.activityList.emptyListMessage} />
          </Typography>
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
                <Button key="mainAction" size="small" variant="outlined">
                  <Msg id={messageIds.activityList.actions.call} />
                </Button>,
              ]}
              href={href}
              Icon={PhoneInTalk}
              info={[
                {
                  Icon: GroupWorkOutlined,
                  labels: [
                    activity.data.campaign?.title,
                    activity.data.organization.title,
                  ],
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
                <Button key="mainAction" size="small" variant="outlined">
                  <Msg id={messageIds.activityList.actions.canvass} />
                </Button>,
              ]}
              href={href}
              Icon={MapsHomeWork}
              info={[]}
              title={
                activity.data.title ||
                messages.defaultTitles.canvassAssignment()
              }
            />
          );
        } else if (activity.kind == 'event') {
          href = `/o/${activity.data.organization.id}/events/${activity.data.id}`;
          elem = <EventListItem event={activity.data} />;
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
