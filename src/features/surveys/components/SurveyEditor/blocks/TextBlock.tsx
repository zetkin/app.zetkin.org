import { Box } from '@mui/material';
import { FC } from 'react';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

interface TextBlockProps {
  element: ZetkinSurveyTextElement;
}

const TextBlock: FC<TextBlockProps> = ({ element }) => {
  return <Box>{JSON.stringify(element)}</Box>;
};

export default TextBlock;
