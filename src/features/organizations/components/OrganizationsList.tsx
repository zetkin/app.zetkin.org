import NextLink from 'next/link';
import { Key } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';

import messageIds from 'features/organizations/l10n/messageIds';
import useMemberships from '../hooks/useMemberships';
import { Msg, useMessages } from 'core/i18n';
import ZUIFuture from 'zui/ZUIFuture';
import { useEnv } from 'core/hooks';

const OrganizationsList = () => {
  const messages = useMessages(messageIds);
  const env = useEnv();
  const organizations = useMemberships();

  return (
    <ZUIFuture future={organizations} ignoreDataWhileLoading>
      {(data) => {
        if (organizations.data && organizations.data.length == 0) {
          return (
            <Alert icon={<Key />} severity="error">
              <AlertTitle>
                <Msg id={messageIds.notOrganizer.title} />
              </AlertTitle>
              <Typography>
                <Msg id={messageIds.notOrganizer.description} />
              </Typography>
              <Typography my={1}>
                <NextLink
                  href={env.vars.ZETKIN_APP_DOMAIN || ''}
                  legacyBehavior
                  passHref
                >
                  <Link>
                    <Msg id={messageIds.notOrganizer.myPageButton} />
                  </Link>
                </NextLink>
              </Typography>
            </Alert>
          );
        }

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
