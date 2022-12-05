import { FunctionComponent } from 'react';
import { Box } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import ZUIOrganizeSidebar from 'zui/ZUIOrganizeSidebar';

const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  root: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: '3.5rem',
    },
  },
}));

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root} display="flex" height="100vh">
      <ZUIOrganizeSidebar />
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        overflow="auto"
        position="relative"
        width={1}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DefaultLayout;
