import { Box } from '@mui/material';
import { FC } from 'react';

import useIsMobile from 'utils/hooks/useIsMobile';
import ZUISection from 'zui/components/ZUISection';
import ZUILogo from 'zui/ZUILogo';
import AccountFooter from './AccountFooter';

type Props = {
  renderContent: () => JSX.Element;
  subtitle?: string;
  title: string;
};

const ResponsiveAccountSection: FC<Props> = ({
  renderContent,
  subtitle,
  title,
}) => {
  const isMobile = useIsMobile();

  return (
    <ZUISection
      borders={!isMobile}
      fullHeight
      renderContent={() => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {renderContent()}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AccountFooter />
          </Box>
        </Box>
      )}
      renderRightHeaderContent={() => <ZUILogo />}
      subtitle={subtitle}
      title={title}
    />
  );
};

export default ResponsiveAccountSection;
