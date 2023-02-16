import { Box } from '@mui/material';
import { FC } from 'react';
import { ZetkinTextQuestion } from 'utils/types/zetkin';

interface OpenQuestionBlockProps {
  question: ZetkinTextQuestion;
}

const OpenQuestionBlock: FC<OpenQuestionBlockProps> = ({ question }) => {
  return <Box>{JSON.stringify(question)}</Box>;
};

export default OpenQuestionBlock;
