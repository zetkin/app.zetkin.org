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
      <h1>Actions</h1>
      <p>Sign up for more actions here.</p>
    </Box>
  );
};

export default Page;
