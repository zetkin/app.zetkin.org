'use client';

import { Box } from '@mui/material';
import { FC } from 'react';

import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUIOrgAvatar from 'zui/components/ZUIOrgAvatar';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  org: ZetkinOrganization;
};

const SubscriptionsManagementPage: FC<Props> = ({ org }) => {
  return (
    <Box>
      <ZUIOrgAvatar orgId={org.id} title={org.title} />
      <ZUIText>{org.title}</ZUIText>
      <ZUIText>Subscriptions management page</ZUIText>
    </Box>
  );
};

export default SubscriptionsManagementPage;
