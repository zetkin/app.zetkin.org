import { Undo } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC } from 'react';

import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  onClick: () => void;
  title: string;
};

const Summary: FC<Props> = ({ onClick, title }) => {
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
      <ZUIText>{title}</ZUIText>
      <ZUIButton
        label="Undo"
        onClick={() => onClick()}
        size="small"
        startIcon={Undo}
      />
    </Box>
  );
};

export default Summary;
