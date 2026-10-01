import { Box, ListItem, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIUserAvatar from 'zui/ZUIUserAvatar';

interface AccessListItemBaseProps {
  action?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
}

interface AccessListItemPersonProps extends AccessListItemBaseProps {
  orgId: number;
  personId: number;
  userId?: never;
}

interface AccessListItemUserProps extends AccessListItemBaseProps {
  orgId?: never;
  personId?: never;
  userId: number;
}

type AccessListItemProps = AccessListItemPersonProps | AccessListItemUserProps;

const AccessListItem: FC<AccessListItemProps> = ({
  action,
  orgId,
  personId,
  subtitle,
  title,
  userId,
}) => {
  return (
    <ListItem>
      <Box alignItems="center" display="flex" gap={2} width="100%">
        <Box>
          {userId !== undefined ? (
            <ZUIUserAvatar personId={userId} size="sm" />
          ) : (
            <ZUIPersonAvatar orgId={orgId!} personId={personId!} size="sm" />
          )}
        </Box>
        <Box flexGrow={1}>
          <Typography component="div">{title}</Typography>
          <Typography color="secondary" component="div" variant="caption">
            {subtitle}
          </Typography>
        </Box>
        <Box>{action}</Box>
      </Box>
    </ListItem>
  );
};

export default AccessListItem;
