import { FC } from 'react';
import NextLink from 'next/link';
import { AppBar, Avatar, Box, Typography } from '@mui/material';

import useCurrentUser from 'features/user/hooks/useCurrentUser';

type HeaderProps = {
  orgId: number;
};

const Header: FC<HeaderProps> = ({ orgId }) => {
  const user = useCurrentUser();

  return (
    <AppBar position="static">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* add the right link */}

        <NextLink href={`/organize/${orgId}`} passHref>
          <Avatar
            src={`/api/orgs/${orgId}/avatar`}
            style={{
              cursor: 'pointer',
              margin: '15px',
            }}
          />
        </NextLink>
        <Typography
          sx={{
            marginBottom: 'auto',
            marginRight: '2vh',
            marginTop: 'auto',
            textAlign: 'center',
          }}
          variant="h6"
        >
          {user?.first_name ?? ''} {user?.last_name ?? ''}
        </Typography>
      </Box>
    </AppBar>
  );
};

export default Header;
