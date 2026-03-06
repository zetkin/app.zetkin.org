import { FC } from 'react';
import { Box, BoxProps } from '@mui/material';

type ZUIScrollingContainerProps = Omit<BoxProps, 'className' | 'overflow'> & {
  disableHorizontal?: boolean;
};

const ZUIScrollingContainer: FC<ZUIScrollingContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <Box
      {...props}
      sx={{
        overflowX: props.disableHorizontal ? 'auto' : 'scroll',
        overflowY: 'scroll',
      }}
    >
      {children}
    </Box>
  );
};

export default ZUIScrollingContainer;
