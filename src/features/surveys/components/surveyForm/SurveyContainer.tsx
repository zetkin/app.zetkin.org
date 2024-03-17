import { Box, BoxProps } from '@mui/material';
import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';

export type SurveyContainerProps = BoxProps & {
  children: ReactNode;
};

const SurveyContainer: ForwardRefRenderFunction<
  unknown,
  SurveyContainerProps
> = ({ children, ...boxProps }, ref) => {
  return (
    <Box
      ref={ref}
      alignItems="center"
      display="flex"
      flexDirection="column"
      {...boxProps}
    >
      <Box flex={1} maxWidth="sm" width="100%">
        {children}
      </Box>
    </Box>
  );
};

export default forwardRef(SurveyContainer);
