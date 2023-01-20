import { Box, ListItem, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import ZUIAvatar from 'zui/ZUIAvatar';

interface AccessListItemProps {
  action?: ReactNode;
  orgId: number;
  personId: number;
  title: string;
}
const AccessListItem: FC<AccessListItemProps> = ({
  action,
  orgId,
  personId,
  title,
}) => {
  return (
    <ListItem>
      <Box alignItems="center" display="flex" gap={2} p={1} width="100%">
        <Box>
          <ZUIAvatar orgId={orgId} personId={personId} />
        </Box>
        <Box flexGrow={1}>
          <Typography>{title}</Typography>
        </Box>
        <Box>{action}</Box>
      </Box>
    </ListItem>
  );
};

export default AccessListItem;
