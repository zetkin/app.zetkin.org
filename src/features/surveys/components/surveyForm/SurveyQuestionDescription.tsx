import { Typography } from '@mui/material';
import { ElementType, FC, ReactElement } from 'react';

export type SurveyQuestionDescriptionProps = {
  children: ReactElement | string;
  component?: ElementType;
  id?: string;
};

const SurveyQuestionDescription: FC<SurveyQuestionDescriptionProps> = ({
  children,
  component = 'p',
  id,
}) => {
  return (
    <Typography
      color="grey.700"
      component={component}
      fontSize="1.1rem"
      id={id}
    >
      {children}
    </Typography>
  );
};

export default SurveyQuestionDescription;
