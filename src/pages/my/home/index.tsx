import { Box } from '@mui/system';
import EventsPage from './EventsPage';
import OrgPage from './OrgPage';
import { scaffold } from 'utils/next';
import TodoPage from './TodoPage';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import EventIcon from '@mui/icons-material/Event';
import { Architecture, CheckBoxSharp, Star } from '@mui/icons-material';
import { Button, Tab, Tabs } from '@mui/material';
import { FC, useState } from 'react';
import { Alert, Divider, Typography, useTheme } from '@mui/material';

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentPage(newValue);
  };

  const theme = useTheme();

  return (
    <Box>
      <Box
        style={{
          background: 'linear-gradient(to bottom right, #f47b9c, #f69382)',
        }}
        sx={{
          pl: '1em',
          color: 'white',
        }}
      >
        <h1 style={{ marginTop: '0' }}>Hello {user?.first_name}</h1>
        <p>
          Welcome to your page. This is where you find events, your own bookings
          and assignments, and where you sign up to new ones.
        </p>
        <Box>
          <Button
            color="primary"
            sx={{
              mb: '1em',
              mr: '1em',
            }}
            variant="contained"
            onClick={() => {
              setCurrentPage('events');
            }}
          >
            To sign-up
          </Button>
          <Button
            color="primary"
            sx={{ mb: '1em' }}
            variant="contained"
            onClick={() => {
              setCurrentPage('todo');
            }}
          >
            My events
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          pl: '1em',
          mu: '0',
          color: 'var(--color-primary)',
        }}
      >
        <h2
          style={{
            margin: '0',
          }}
        >
          Next up
        </h2>
        <Box>
          <div>TODO: Add event / call assignment / task here</div>
        </Box>
      </Box>
      <Tabs
        onChange={handleChange}
        value={currentPage}
        variant="scrollable"
        sx={{
          mu: '0',
          height: '0',
        }}
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
