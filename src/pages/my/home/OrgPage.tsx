import { Box } from '@mui/system';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import { ZetkinMembership } from 'utils/types/zetkin';
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
  const organizations = useOrganizations();
  //console.log("organizations", organizations);
  return (
    <div>
      <h1>Organizations</h1>
      <ZUIFuture future={organizations}>
        {(data) => (
          <List>
            {data?.map((org: ZetkinMembership['organization']) => (
              <ListItem key={org.id}>
                <h2>{org.title}</h2>
              </ListItem>
            ))}
          </List>
        )}
      </ZUIFuture>
    </div>
  );
};

export default Page;
