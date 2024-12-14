'use client';

import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { MapsHomeWork, PhoneInTalk } from '@mui/icons-material';

import useMyActivities from '../hooks/useMyActivities';
import MyActivityListItem from './MyActivityListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import EventListItem from './EventListItem';

const MyActivitiesList: FC = () => {
  const activities = useMyActivities();
  const messages = useMessages(messageIds);

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {activities.map((activity) => {
        if (activity.kind == 'call') {
          const href = `/call/${activity.data.id}`;
          return (
            <MyActivityListItem
              key={href}
              actions={[
                <Button key="mainAction" size="small" variant="outlined">
                  <Msg id={messageIds.actions.call} />
                </Button>,
              ]}
              href={href}
              Icon={PhoneInTalk}
              info={[]}
              title={
                activity.data.title || messages.defaultTitles.callAssignment()
              }
            />
          );
        } else if (activity.kind == 'canvass') {
          const href = `/canvass/${activity.data.id}`;
          return (
            <MyActivityListItem
              key={href}
              actions={[
                <Button key="mainAction" size="small" variant="outlined">
                  <Msg id={messageIds.actions.canvass} />
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
          return (
            <EventListItem
              key={'event-' + activity.data.id}
              event={activity.data}
            />
          );
        }
      })}
    </Box>
  );
};

export default MyActivitiesList;
