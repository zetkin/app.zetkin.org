import { AppBar, Avatar, Box, Typography } from '@mui/material';
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
        {(data) => {
          return (
            <>
              <AppBar position="static"></AppBar>

              <Typography>{data.title}</Typography>
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                overflow="hidden"
              >
                <Avatar
                  src={`/api/orgs/${parseInt(orgId)}/avatar`}
                  style={{ margin: '15px' }}
                />
                <Typography>{data.organization?.title}</Typography>
              </Box>
              <Box>
                <Typography>{data.info_text ?? ''}</Typography>
              </Box>
            </>
          );
        }}
      </ZUIFuture>
    </>
  );
};

export default Header;
