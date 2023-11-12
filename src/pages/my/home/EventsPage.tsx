import { Box } from '@mui/system';
import EventSignUpList from 'features/events/components/EventSignUpList';
import { FC } from 'react';
import useCurrentUserEvents from 'features/user/hooks/useCurrentUserEvents';
import { scaffold } from 'utils/next';
import ZUIFuture from 'zui/ZUIFuture';

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
  const events = useCurrentUserEvents();
  return (
    <Box
      sx={{
        pl: '1em',
        pr: '1em',
      }}
    >
      <h1>All Events</h1>
      <p>Sign up for more events here.</p>
      <ZUIFuture future={events}>
        {(data) => <EventSignUpList events={data} />}
      </ZUIFuture>
      <p>
        TODO: Add events here, and a button for filtering between event type and
        project, (and organization?)
      </p>
    </Box>
  );
};

export default Page;
