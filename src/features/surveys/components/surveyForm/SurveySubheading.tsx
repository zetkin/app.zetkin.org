import { Typography } from '@mui/material';
import { FC, ReactElement } from 'react';

export type SurveySubheadingProps = {
  children: ReactElement | string;
};

const SurveySubheading: FC<SurveySubheadingProps> = ({ children }) => {
  return (
    <Typography
      component="span"
      style={{
        color: 'black',
        display: 'block',
        fontSize: '1.5em',
        fontWeight: '500',
        marginBottom: '0.5em',
        marginTop: '0.5em',
      }}
    >
      {children}
    </Typography>
  );
};

export default SurveySubheading;
