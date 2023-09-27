import { Box, ListItem, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';

interface AccessListItemProps {
  action?: ReactNode;
  orgId: number;
  personId: number;
  subtitle?: ReactNode;
  title: ReactNode;
}
const AccessListItem: FC<AccessListItemProps> = ({
  action,
  orgId,
  personId,
  subtitle,
  title,
}) => {
  return (
    <ListItem>
      <Box alignItems="center" display="flex" gap={2} width="100%">
        <Box>
          <ZUIPersonAvatar orgId={orgId} personId={personId} size="sm" />
        </Box>
        <Box flexGrow={1}>
          <Typography component="div">{title}</Typography>
          <Typography color="gray" component="div" variant="caption">
            {subtitle}
          </Typography>
        </Box>
        <Box>{action}</Box>
      </Box>
    </ListItem>
  );
};

export default AccessListItem;
