import { Box } from '@mui/material';
import { FC } from 'react';

import DeleteHideButtons from './DeleteHideButtons';
import { ZetkinTextQuestion } from 'utils/types/zetkin';

interface OpenQuestionBlockProps {
  hidden: boolean;
  onDelete: () => void;
  onToggleHidden: (hidden: boolean) => void;
  question: ZetkinTextQuestion;
}

const OpenQuestionBlock: FC<OpenQuestionBlockProps> = ({
  hidden,
  onDelete,
  onToggleHidden,
  question,
}) => {
  return (
    <Box>
      {JSON.stringify(question)}
      <Box display="flex" justifyContent="end" m={2}>
        <DeleteHideButtons
          hidden={hidden}
          onDelete={onDelete}
          onToggleHidden={onToggleHidden}
        />
      </Box>
    </Box>
  );
};

export default OpenQuestionBlock;
