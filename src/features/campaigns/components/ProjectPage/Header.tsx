import { AppBar, Avatar, Box, Button, Icon, Typography } from '@mui/material';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { FC } from 'react';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';

type HeaderProps = {
  orgId: string;
  campId: string;
};

const Header: FC<HeaderProps> = ({ orgId, campId }) => {
  //TODO: render title of project
  //render title of organize
  // description of project

  const { campaignFuture } = useCampaign(parseInt(orgId), parseInt(campId));

  /*  children: ReactNode;
  header: string | JSX.Element;
  status?: ReactNode;
  subheader?: string;*/
  return (
    <>
      <ZUIFuture future={campaignFuture}>
        {(data) => (
          <>
            <AppBar position="static">
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Icon></Icon>
              </Typography>
              <Button color="inherit">Login</Button>
            </AppBar>

            <Typography>{data.title}</Typography>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              overflow="hidden"
            ></Box>
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
