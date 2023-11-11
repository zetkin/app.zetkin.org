import { Box } from '@mui/system';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import {List, ListItem} from '@mui/material';
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
  const organizations = useOrganizations();
  return (
    <Box>
      <h1>Organizations</h1>
      <ZUIFuture future={organizations}>
        {(data) => {
          return (
            <List>
              {data?.map((org: ZetkinMembership['organization']) => {
                <ListItem key={org.id}>
                  <h2>{org.name}</h2>
                </ListItem>
              }}
            </List>
              )
        }}
      </ZUIFuture>
    </Box>
  );
};

export default Page;
