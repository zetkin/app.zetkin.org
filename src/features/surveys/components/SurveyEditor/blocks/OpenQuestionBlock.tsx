import { FC } from 'react';
import { Box, IconButton } from '@mui/material';
import { Delete, RemoveRedEye } from '@mui/icons-material';

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
        <IconButton onClick={() => onToggleHidden(!hidden)}>
          <RemoveRedEye />
        </IconButton>
        <IconButton
          onClick={(evt) => {
            evt.stopPropagation();
            onDelete();
          }}
        >
          <Delete />
        </IconButton>
      </Box>
    </Box>
  );
};

export default OpenQuestionBlock;
