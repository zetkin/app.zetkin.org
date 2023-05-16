import messageIds from 'features/organizations/l10n/messageIds';
import NextLink from 'next/link';
import OrganizationsDataModel from '../models/OrganizationsDataModel';
import { useMessages } from 'core/i18n';
import { ZetkinOrganization } from 'utils/types/zetkin';

import ZUIFuture from 'zui/ZUIFuture';
import { Avatar, Box, Link, List, ListItem, Typography } from '@mui/material';

interface UserOrganizationsProps {
  model: OrganizationsDataModel;
}

const OrganizationsList = ({ model }: UserOrganizationsProps) => {
  const messages = useMessages(messageIds);

  return (
    <ZUIFuture future={model.getData()}>
      {(data) => {
        return (
          <Box style={{ margin: '30px' }}>
            <Typography variant="h3">{messages.page.title()}</Typography>
            <List>
              {data.map((org: ZetkinOrganization) => {
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
