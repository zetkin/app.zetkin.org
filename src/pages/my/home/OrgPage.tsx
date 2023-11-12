import { FC } from 'react';
import NextLink from 'next/link';
import { scaffold } from 'utils/next';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import { ZetkinMembership } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { Avatar, Box, Link, List, ListItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/Icon';

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
    <Box
      sx={{
        pl: '1em',
        pr: '1em',
      }}
    >
      <p>
        In order to take part in your organization's work you have to be
        connected. These are the organizations you are connected to today.
      </p>
      <ZUIFuture future={organizations}>
        {(data) => (
          <List
            sx={{
              ml: '1em',
            }}
          >
            {data?.map((org: ZetkinMembership['organization']) => (
              <ListItem
                key={org.id}
                sx={{ color: 'var(--color-primary)', ml: '-1em' }}
                secondaryAction={
                  <Link
                    underline="hover"
                    sx={{ fontSize: '0.8em', alignSelf: 'flex-start' }}
                  >
                    Disconnect
                    <br />
                    <br />
                  </Link>
                }
              >
                <ListItemAvatar sx={{ mr: '10px', ml: '-1em' }}>
                  <Avatar src={`/api/orgs/${org.id}/avatar`} />
                </ListItemAvatar>
                <ListItemText
                  sx={{ ml: '-1em' }}
                  primary={
                    <Link underline="hover" href={`/o/${org.id}`}>
                      {org.title}
                    </Link>
                  }
                  secondary="TODO"
                />
              </ListItem>
            ))}
          </List>
        )}
      </ZUIFuture>
    </Box>
  );
};

export default Page;
