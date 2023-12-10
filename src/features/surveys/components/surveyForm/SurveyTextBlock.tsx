import { FC } from 'react';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';
import { Box, Typography } from '@mui/material';

export type SurveyTextBlockProps = {
  element: ZetkinSurveyTextElement;
};

const SurveyTextBlock: FC<SurveyTextBlockProps> = ({ element }) => {
  return (
    <Box>
      <Typography>{element.text_block.header}</Typography>
      <Typography>{element.text_block.content}</Typography>
    </Box>
  );
};

export default SurveyTextBlock;
