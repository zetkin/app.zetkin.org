import { FC } from 'react';
import SurveyContainer from './SurveyContainer';
import { Typography } from '@mui/material';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

export type SurveyTextBlockProps = {
  element: ZetkinSurveyTextElement;
};

const SurveyTextBlock: FC<SurveyTextBlockProps> = ({ element }) => {
  return (
    <SurveyContainer>
      <Typography>{element.text_block.header}</Typography>
      <Typography>{element.text_block.content}</Typography>
    </SurveyContainer>
  );
};

export default SurveyTextBlock;
