'use client';

import { FC } from 'react';
import { Box, Button, Fade } from '@mui/material';
import {
  GroupWorkOutlined,
  MapsHomeWork,
  PhoneInTalk,
} from '@mui/icons-material';

import useMyActivities from '../hooks/useMyActivities';
import MyActivityListItem from './MyActivityListItem';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import EventListItem from './EventListItem';
import useIncrementalDelay from '../hooks/useIncrementalDelay';

const MyActivitiesList: FC = () => {
  const activities = useMyActivities();
  const messages = useMessages(messageIds);
  const nextDelay = useIncrementalDelay();

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {activities.map((activity) => {
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
