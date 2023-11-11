import { Box } from '@mui/system';
import CallAssignments from './CallAssignments';

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
    <Box>
      <h1>Todo</h1>
      <CallAssignments />
    </Box>
  );
};

export default Page;
