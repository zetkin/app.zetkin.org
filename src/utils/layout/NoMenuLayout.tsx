import { Box } from '@mui/material';
import { FunctionComponent } from 'react';

import makeStyles from '@mui/styles/makeStyles';
import ZUIOrganizeSidebarNoMenu from 'zui/ZUIOrganizeSidebarNoMenu';

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

interface NoMenuLayoutProps {
  children?: React.ReactNode;
}

const NoMenuLayout: FunctionComponent<NoMenuLayoutProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root} display="flex" height="100vh">
      <ZUIOrganizeSidebarNoMenu />
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

export default NoMenuLayout;
