import { Typography } from '@mui/material';
import { FC, ReactElement } from 'react';

export type SurveySubheadingProps = {
  children: ReactElement | string;
};

const SurveySubheading: FC<SurveySubheadingProps> = ({ children }) => {
  return (
    <Typography
      color="text.primary"
      component="span"
      fontSize="1.3rem"
      fontWeight="bold"
    >
      {children}
    </Typography>
  );
};

export default SurveySubheading;
