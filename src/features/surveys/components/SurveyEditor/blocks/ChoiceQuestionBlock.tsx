import { Box } from '@mui/material';
import { FC } from 'react';
import { ZetkinOptionsQuestion } from 'utils/types/zetkin';

interface ChoiceQuestionBlockProps {
  question: ZetkinOptionsQuestion;
}

const ChoiceQuestionBlock: FC<ChoiceQuestionBlockProps> = ({ question }) => {
  return <Box>{JSON.stringify(question)}</Box>;
};

export default ChoiceQuestionBlock;
