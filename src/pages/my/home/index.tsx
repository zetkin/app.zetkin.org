import { Box } from '@mui/system';
import EventsPage from './EventsPage';
import OrgPage from './OrgPage';
import { scaffold } from 'utils/next';
import TodoPage from './TodoPage';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import { Architecture, CheckBoxSharp, Star } from '@mui/icons-material';
import { Button, Tab, Tabs } from '@mui/material';
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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentPage(newValue);
  };

  return (
    <Box>
      <Box
        style={{
          background: 'linear-gradient(to bottom right, #f47b9c, #f69382)',
          color: 'white',
          paddingLeft: '1em',
        }}
      >
        <h1 style={{ marginTop: '0' }}>Hello {user?.first_name}</h1>
        <p>
          Welcome to your page. This is where you find ongoing projects, your
          own bookings and assignments, and sign up to new ones.
        </p>
        <Box>
          <Button
            color="primary"
            sx={{
              mb: '1em',
              mr: '1em',
            }}
            variant="contained"
          >
            To sign-up
          </Button>
          <Button color="primary" sx={{ mb: '1em' }} variant="contained">
            My events
          </Button>
        </Box>
      </Box>
      <Tabs
        aria-label="secondary tabs example"
        indicatorColor="secondary"
        onChange={handleChange}
        textColor="secondary"
        value={currentPage}
        variant="scrollable"
      >
        <Tab
          icon={<Architecture />}
          iconPosition="start"
          label="Events"
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
