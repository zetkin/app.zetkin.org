import { Box } from '@mui/system';
import { FC } from 'react';
import { scaffold } from 'utils/next';

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
  return (
    <Box
      style={{
        paddingLeft: '1em',
      }}
    >
      <h1>All Events</h1>
      <p>Sign up for more events here.</p>
      <p>
        TODO: Add events here, and a button for filtering between event type and
        project, (and organization?)
      </p>
    </Box>
  );
};

export default Page;
