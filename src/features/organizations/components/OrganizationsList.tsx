import NextLink from 'next/link';
import { Avatar, Box, Link, List, ListItem, Typography } from '@mui/material';

import messageIds from 'features/organizations/l10n/messageIds';
import useMemberships from 'features/campaigns/hooks/useMemberships';
import { useMessages } from 'core/i18n';
import ZUIFuture from 'zui/ZUIFuture';

const OrganizationsList = () => {
  const messages = useMessages(messageIds);
  const organizations = useMemberships();

  return (
    <ZUIFuture future={organizations}>
      {(data) => {
        return (
          <Box style={{ margin: '30px' }}>
            <Typography variant="h3">{messages.page.title()}</Typography>
            <List>
              {data?.map((membership) => {
                const orgId = membership.organization.id;
                return (
                  <ListItem key={orgId}>
                    <Avatar
                      src={`/api/orgs/${orgId}/avatar`}
                      style={{ margin: '15px' }}
                    />
                    <NextLink
                      href={`/organize/${orgId}`}
                      legacyBehavior
                      passHref
                    >
                      <Link underline="hover">
                        {membership.organization.title}
                      </Link>
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
