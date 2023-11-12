import { FC } from 'react';
import NextLink from 'next/link';
import { AppBar, Avatar, Box, Typography } from '@mui/material';

import useCampaign from 'features/campaigns/hooks/useCampaign';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import ZUIFuture from 'zui/ZUIFuture';

type HeaderProps = {
  campId: number;
  orgId: number;
};

const Header: FC<HeaderProps> = ({ orgId, campId }) => {
  const { campaignFuture } = useCampaign(orgId, campId);

  const user = useCurrentUser();

  return (
    <>
      <ZUIFuture future={campaignFuture}>
        {(data) => (
          <>
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
                  variant="h7"
                  sx={{
                    marginRight: '2vh',
                    marginBottom: 'auto',
                    marginTop: 'auto',
                    textAlign: 'center',
                  }}
                >
                  {user?.first_name ?? ''} {user?.last_name ?? ''}
                </Typography>
              </Box>
            </AppBar>
          </>
        )}
      </ZUIFuture>
    </>
  );
};

export default Header;
