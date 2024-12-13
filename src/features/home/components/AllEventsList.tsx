import { FC, useState } from 'react';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

import { getContrastColor } from 'utils/colorUtils';
import useAllEvents from 'features/events/hooks/useAllEvents';
import EventListItem from './EventListItem';
import useMemberships from 'features/organizations/hooks/useMemberships';

const AllEventsList: FC = () => {
  const allEvents = useAllEvents();
  const memberships = useMemberships().data;

  const [orgDrawerOpen, setOrgDrawerOpen] = useState(false);
  const [orgIdsToFilterBy, setOrgIdsToFilterBy] = useState<number[]>([]);

  const orgs = [
    ...new Map(
      allEvents
        .map((event) => event.organization)
        .map((org) => [org['id'], org])
    ).values(),
  ];

  const filteredEvents = allEvents.filter((event) => {
    if (orgIdsToFilterBy.length == 0) {
      return true;
    }
    return orgIdsToFilterBy.includes(event.organization.id);
  });

  const memberOfMoreThanOneOrg = memberships && memberships.length > 1;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      padding={1}
      position="relative"
    >
      <Box>
        {memberOfMoreThanOneOrg && (
          <Box
            onClick={() => setOrgDrawerOpen(true)}
            sx={(theme) => ({
              backgroundColor: orgIdsToFilterBy.length
                ? theme.palette.primary.main
                : '',
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: '2em',
              color: orgIdsToFilterBy.length
                ? getContrastColor(theme.palette.primary.main)
                : theme.palette.text.primary,
              cursor: 'pointer',
              display: 'inline-flex',
              paddingX: 1,
              paddingY: 1,
            })}
          >{`Organization ${orgIdsToFilterBy.length || ''}`}</Box>
        )}
      </Box>
      {filteredEvents.map((event) => (
        <EventListItem key={event.id} event={event} />
      ))}
      {orgDrawerOpen && (
        <>
          <Box
            bgcolor="black"
            bottom={0}
            height="100%"
            left={0}
            onClick={() => setOrgDrawerOpen(false)}
            position="fixed"
            sx={{ opacity: '30%' }}
            width="100%"
            zIndex={9999}
          />
          <Box
            sx={{
              WebkitOverflowScrolling: 'touch',
              bgcolor: 'white',
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              height: 'auto',
              left: 0,
              maxHeight: '100%',
              outline: 0,
              position: 'fixed',
              right: 0,
              top: 'auto',
              width: '100%',
              zIndex: 10000,
            }}
          >
            <Box
              onClick={() => setOrgDrawerOpen(false)}
              sx={(theme) => ({
                alignItems: 'center',
                bgcolor: theme.palette.common.white,
                borderRadius: '100%',
                display: 'flex',
                height: '32px',
                justifyContent: 'center',
                left: '50%',
                position: 'absolute',
                top: -40,
                transform: 'translateX(-50%)',
                width: '32px',
              })}
            >
              <KeyboardArrowDown color="secondary" />
            </Box>
            <List>
              {orgs.map((org) => (
                <ListItem key={org.id} sx={{ justifyContent: 'space-between' }}>
                  <Box alignItems="center" display="flex">
                    <ListItemAvatar>
                      <Avatar alt="icon" src={`/api/orgs/${org.id}/avatar`} />
                    </ListItemAvatar>
                    <ListItemText>{org.title}</ListItemText>
                  </Box>
                  <Switch
                    checked={orgIdsToFilterBy.includes(org.id)}
                    onChange={(ev, checked) => {
                      if (checked) {
                        setOrgIdsToFilterBy([...orgIdsToFilterBy, org.id]);
                      } else {
                        setOrgIdsToFilterBy(
                          orgIdsToFilterBy.filter((id) => id != org.id)
                        );
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AllEventsList;
