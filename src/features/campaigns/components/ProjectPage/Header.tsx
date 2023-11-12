/* eslint-disable sort-keys */
/* eslint-disable sort-imports */
import NextLink from 'next/link';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import ZUIFuture from 'zui/ZUIFuture';
import { FC } from 'react';
import { AppBar, Avatar, Box, Button, Icon, Typography } from '@mui/material';
import useCurrentUser from 'features/user/hooks/useCurrentUser';

type HeaderProps = {
  campId: string;
  orgId: string;
};

const Header: FC<HeaderProps> = ({ orgId, campId }) => {
  //TODO: render title of project
  //render title of organize
  // description of project

  const { campaignFuture } = useCampaign(parseInt(orgId), parseInt(campId));

  const user = useCurrentUser();

  return (
    <>
      <ZUIFuture future={campaignFuture}>
        {(data) => (
          <>
            <AppBar
              position="static">
              <Box sx={{
                display: 'flex', justifyContent: 'space-between',
              }}>
                {/* add the right link */}

                <NextLink
                  href={`/organize/${orgId}`} passHref
                >
                  <Avatar src={`/api/orgs/${orgId}/avatar`}
                    style={{
                      cursor: 'pointer',
                      margin: '15px'
                    }} />
                </NextLink>
                <Typography sx={{
                  marginTop: 'auto', marginBottom: 'auto', textAlign: 'center'
                }}

                >
                  {user?.first_name ?? ""} {user?.last_name ?? ""}
              </Typography>

              </Box>
            </AppBar>

            <Typography>{data.title}</Typography>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              overflow="hidden"
            />
            <Box>
              <Typography>{data.info_text ?? ''}</Typography>
            </Box>
          </>
        )}
      </ZUIFuture>
    </>
  );
};

export default Header;
