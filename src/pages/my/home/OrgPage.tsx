import { FC } from 'react';
import NextLink from 'next/link';
import { scaffold } from 'utils/next';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import { ZetkinMembership } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { Box, Link } from '@mui/material';
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
  return (
    <Box>
      <h1>Organizations</h1>
      <ZUIFuture future={organizations}>
        {(data) => (
          <List>
            {data?.map((org: ZetkinMembership['organization']) => (
              <ListItem key={org.id}>
                <NextLink href={`/o/${org.id}`} passHref>
                  <Link color="inherit" underline="none">
                    {org.title}
                  </Link>
                </NextLink>
              </ListItem>
            ))}
          </List>
        )}
      </ZUIFuture>
    </Box>
  );
};

export default Page;
