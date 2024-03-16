import { FC } from 'react';
import SurveyContainer from './SurveyContainer';
import SurveySubheading from './SurveySubheading';
import { Typography } from '@mui/material';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

export type SurveyTextBlockProps = {
  element: ZetkinSurveyTextElement;
};

const SurveyTextBlock: FC<SurveyTextBlockProps> = ({ element }) => {
  return (
    <SurveyContainer>
      <SurveySubheading component="h2">
        {element.text_block.header}
      </SurveySubheading>
      <Typography>{element.text_block.content}</Typography>
    </SurveyContainer>
  );
};

export default SurveyTextBlock;
