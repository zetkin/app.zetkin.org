import messageIds from 'features/organizations/l10n/messageIds';
import NextLink from 'next/link';
import { useMessages } from 'core/i18n';
import useOrganizations from '../hooks/useOrganizations';
import { ZetkinMembership } from 'utils/types/zetkin';

import ZUIFuture from 'zui/ZUIFuture';
import { Avatar, Box, Link, List, ListItem, Typography } from '@mui/material';

const OrganizationsList = () => {
  const messages = useMessages(messageIds);

  return (
    <ZUIFuture future={useOrganizations()}>
      {(data) => {
        return (
          <Box style={{ margin: '30px' }}>
            <Typography variant="h3">{messages.page.title()}</Typography>
            <List>
              {data.map((org: ZetkinMembership['organization']) => {
                return (
                  <ListItem key={org.id}>
                    <Avatar
                      src={`/api/orgs/${org.id}/avatar`}
                      style={{ margin: '15px' }}
                    />
                    <NextLink href={`/organize/${org.id}`} passHref>
                      <Link underline="hover">{org.title}</Link>
                    </NextLink>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default OrganizationsList;
