import { Box } from '@mui/material';
import { createContext, FunctionComponent, useState } from 'react';

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
  onScroll?: () => void;
}

const UglyContext = createContext<{
  container: HTMLDivElement | null;
}>({ container: null });

export { UglyContext };

const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({
  children,
  onScroll,
}) => {
  const classes = useStyles();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <Box className={classes.root} display="flex" height="100vh">
      <ZUIOrganizeSidebar />
      <Box
        ref={(div: HTMLDivElement) => setContainer(div)}
        display="flex"
        flexDirection="column"
        height="100vh"
        onScroll={onScroll}
        overflow="auto"
        position="relative"
        width={1}
      >
        <UglyContext.Provider value={{ container }}>
          {children}
        </UglyContext.Provider>
      </Box>
    </Box>
  );
};

export default DefaultLayout;
