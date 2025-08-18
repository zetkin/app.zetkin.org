import { Box } from '@mui/material';
import { FC } from 'react';

import ZUIDivider from 'zui/components/ZUIDivider';
import useIsMobile from 'utils/hooks/useIsMobile';

type Props = {
  primaryButton: JSX.Element;
  secondaryButton?: JSX.Element;
  title: JSX.Element;
  topLeft: JSX.Element;
};

const HeaderBase: FC<Props> = ({
  topLeft,
  title,
  primaryButton,
  secondaryButton,
}) => {
  const isMobile = useIsMobile();

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
        })}
      >
        <Box sx={{ paddingBottom: !isMobile ? 1 : 0 }}>{topLeft}</Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 0,
            justifyContent: 'space-between',
          }}
        >
          {title}
          <Box
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              flexShrink: 0,
              gap: 2,
              justifyContent: 'flex-end',
            }}
          >
            {secondaryButton && secondaryButton}
            {primaryButton}
          </Box>
        </Box>
      </Box>
      <ZUIDivider />
    </Box>
  );
};

export default HeaderBase;
