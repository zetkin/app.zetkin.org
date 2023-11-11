import { Box } from '@mui/system';
import CallAssignmentList from './CallAssignmentList';
import { FC } from 'react';
import { HeadsetMic } from '@mui/icons-material';
import { scaffold } from 'utils/next';
import useCurrentUserCallAssignments from 'features/user/hooks/useCurrentUserCallAssigments';
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
  const callAssignments = useCurrentUserCallAssignments();
  return (
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: '5px',
          margin: 2,
        }}
      >
        <h2>Call Assignments</h2>
        <HeadsetMic />
      </Box>
      <ZUIFuture future={callAssignments}>
        {(data) => <CallAssignmentList callAssignments={data} />}
      </ZUIFuture>
    </Box>
  );
};

export default Page;
