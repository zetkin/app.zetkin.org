import { Box, BoxProps } from '@mui/material';
import { FC, ReactNode } from 'react';

export type SurveyContainerProps = BoxProps & {
  children: ReactNode;
};

const SurveyContainer: FC<SurveyContainerProps> = ({
  children,
  ...boxProps
}) => {
  return (
    <Box
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

export default SurveyContainer;
