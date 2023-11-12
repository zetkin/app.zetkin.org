import EventIcon from '@mui/icons-material/Event';
import EventsPage from './EventsPage';
import ListItemText from '@mui/material/ListItemText';
import OrgPage from './OrgPage';
import { scaffold } from 'utils/next';
import TodoPage from './TodoPage';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import { Box, Button, ListItem, Tab, Tabs, Typography } from '@mui/material';
import { CheckBoxSharp, Star } from '@mui/icons-material';
import { FC, useState } from 'react';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type PageProps = void;

const Page: FC<PageProps> = () => {
  const user = useCurrentUser();
  const [currentPage, setCurrentPage] = useState('events');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentPage(newValue);
  };

  return (
    <Box>
      <Box
        style={{
          background: 'linear-gradient(to bottom right, #f47b9c, #f69382)',
        }}
        sx={{
          color: 'white',
          pl: '1em',
          pr: '1em',
        }}
      >
        <h1
          style={{
            marginBottom: '0',
            marginTop: '0',
          }}
        >
          Hello {user?.first_name}
        </h1>
        <p
          style={{
            marginBottom: '1em',
            marginTop: '0.5em',
          }}
        >
          Welcome to your page. This is where you find events, your own bookings
          and assignments, and where you sign up to new ones.
        </p>
        <Box>
          <Button
            color="primary"
            onClick={() => {
              setCurrentPage('events');
              setTimeout(() => {
                document
                  .getElementById('events')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            sx={{
              mb: '1em',
              mr: '1em',
            }}
            variant="contained"
          >
            To sign-up
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setCurrentPage('todo');
              setTimeout(() => {
                document
                  .getElementById('myTodo')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            sx={{ mb: '1em' }}
            variant="contained"
          >
            My events
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          color: 'var(--color-primary)',
          mu: '0',
          pl: '1em',
        }}
      >
        <h2
          style={{
            marginBottom: '0',
            marginTop: '0',
          }}
        >
          Next up
        </h2>
        <Box>
          <ListItem
            secondaryAction={
              <Button color="primary" sx={{ mb: '1em' }} variant="contained">
                To event
              </Button>
            }
            sx={{ color: 'var(--color-primary)', my: '0', py: '0' }}
          >
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 'bolder' }}>
                  Cooking with grandma
                </Typography>
              }
              secondary="20/11"
              sx={{ ml: '-1em' }}
            />
          </ListItem>
        </Box>
      </Box>
      <Tabs
        onChange={handleChange}
        sx={{
          height: '0',
          mu: '0',
        }}
        value={currentPage}
        variant="scrollable"
      >
        <Tab
          icon={<EventIcon />}
          iconPosition="start"
          label="All Events"
          value="events"
        />
        <Tab
          icon={<CheckBoxSharp />}
          iconPosition="start"
          label="My Todo"
          value="todo"
        />
        <Tab
          icon={<Star />}
          iconPosition="start"
          label="Organizations"
          value="organizations"
        />
      </Tabs>
      {currentPage === 'events' && <EventsPage />}
      {currentPage === 'todo' && <TodoPage />}
      {currentPage === 'organizations' && <OrgPage />}
    </Box>
  );
};

export default Page;

/*
 */
