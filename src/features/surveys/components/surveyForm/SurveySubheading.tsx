import { Typography } from '@mui/material';
import { ElementType, FC, ReactElement } from 'react';

export type SurveySubheadingProps = {
  children: ReactElement | string;
  component?: ElementType;
};

const SurveySubheading: FC<SurveySubheadingProps> = ({
  children,
  component = 'span',
}) => {
  return (
    <Typography
      color="text.primary"
      component={component}
      fontSize="1.3rem"
      fontWeight="bold"
    >
      {children}
    </Typography>
  );
};

export default SurveySubheading;
