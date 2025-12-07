import { Box } from '@mui/material';
import { FunctionComponent, Suspense, useState } from 'react';

import { PageContainerContext } from 'utils/panes/PageContainerContext';
import ZUIOrganizeSidebar from 'zui/ZUIOrganizeSidebar';
import oldTheme from 'theme';

interface DefaultLayoutProps {
  children: React.ReactNode;
  onScroll?: () => void;
}

const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({
  children,
  onScroll,
}) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <Box
      display="flex"
      height="100vh"
      sx={{
        [oldTheme.breakpoints.down('sm')]: {
          paddingTop: '3.5rem',
        },
      }}
    >
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <ZUIOrganizeSidebar />
      </Suspense>
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
        <PageContainerContext.Provider value={{ container }}>
          {children}
        </PageContainerContext.Provider>
      </Box>
    </Box>
  );
};

export default DefaultLayout;
