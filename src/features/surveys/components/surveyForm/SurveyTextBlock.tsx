import { FC } from 'react';
import { Typography } from '@mui/material';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

export type SurveyTextBlockProps = {
  element: ZetkinSurveyTextElement;
};

const SurveyTextBlock: FC<SurveyTextBlockProps> = ({ element }) => {
  return <Typography>{element.text_block.content}</Typography>;
};

export default SurveyTextBlock;
