import { FC } from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { scaffold } from 'utils/next';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import { ZetkinMembership } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { Avatar, Box, Link, List, ListItem } from '@mui/material';

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
              <>
                <ListItem
                  key={org.id}
                  divider={true}
                  secondaryAction={
                    <Link
                      sx={{ alignSelf: 'flex-start', fontSize: '0.8em' }}
                      underline="hover"
                    >
                      Disconnect
                      <br />
                      <br />
                    </Link>
                  }
                  sx={{ color: 'var(--color-primary)', ml: '-1em' }}
                >
                  <ListItemAvatar sx={{ ml: '-1em', mr: '10px' }}>
                    <Avatar src={`/api/orgs/${org.id}/avatar`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link href={`/o/${org.id}`} underline="hover">
                        {org.title}
                      </Link>
                    }
                    secondary="TODO"
                    sx={{ ml: '-1em' }}
                  />
                </ListItem>
              </>
            ))}
          </List>
        )}
      </ZUIFuture>
    </Box>
  );
};

export default Page;
