import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

import { getContrastColor } from 'utils/colorUtils';
import ZUIText from 'zui/components/ZUIText';

const FilterButton: FC<{
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  round?: boolean;
}> = ({ active, children, onClick, round }) => {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor: active ? theme.palette.primary.main : '',
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '2em',
        color: active
          ? getContrastColor(theme.palette.primary.main)
          : theme.palette.text.primary,
        cursor: 'pointer',
        display: 'inline-flex',
        flexShrink: 0,
        paddingX: round ? '3px' : '10px',
        paddingY: '3px',
      })}
    >
      <ZUIText variant="bodySmRegular">{children}</ZUIText>
    </Box>
  );
};

export default FilterButton;
