import { FC } from 'react';
import { Avatar, Box, Typography } from '@mui/material';

import useOrgUser from '../hooks/useOrgUser';

type Props = {
  orgId: number;
  userId: number;
};

const UserItem: FC<Props> = ({ orgId, userId }) => {
  const user = useOrgUser(orgId, userId);
  const name = `${user.first_name} ${user.last_name}`;

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 1,
      }}
    >
      <Avatar src={`/api/users/${userId}/avatar`} />
      <Typography>{name}</Typography>
    </Box>
  );
};

export default UserItem;
