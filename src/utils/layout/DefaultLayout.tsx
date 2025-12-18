import { Box } from '@mui/material';
import { FunctionComponent, ReactElement, useState } from 'react';

import { PageContainerContext } from 'utils/panes/PageContainerContext';
import ZUIOrganizeSidebar from 'zui/ZUIOrganizeSidebar';
import oldTheme from 'theme';

interface DefaultLayoutProps {
  children: React.ReactNode;
  onScroll?: () => void;
  title?: string | ReactElement;
}

const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({
  children,
  onScroll,
  title,
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
      <ZUIOrganizeSidebar title={title} />
      <Box
        ref={(div: HTMLDivElement) => setContainer(div)}
        display="flex"
        flexDirection="column"
        onScroll={onScroll}
        overflow="auto"
        position="relative"
        sx={{
          [oldTheme.breakpoints.up('sm')]: {
            height: '100vh',
          },
        }}
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
