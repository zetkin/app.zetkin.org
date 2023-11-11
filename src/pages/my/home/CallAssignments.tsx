import { Box } from '@mui/system';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import useCurrentUserCallAssignments from 'features/user/hooks/useCurrentUserCallAssigments';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { List, ListItem } from '@mui/material';

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
      <h2>Call Assignments</h2>
      <ZUIFuture future={callAssignments}>
        {(data) => (
          <List>
            {data?.map((callAssignment: ZetkinCallAssignment) => (
              <ListItem key={callAssignment.id}>
                <p>{callAssignment.title}</p>
              </ListItem>
            ))}
          </List>
        )}
      </ZUIFuture>
    </Box>
  );
};

export default Page;
