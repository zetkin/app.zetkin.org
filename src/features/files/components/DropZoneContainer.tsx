import { Box, lighten, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  state: 'accepting' | 'loading';
};

const DropZoneContainer: FC<Props> = ({ children, state }) => {
  const theme = useTheme();

  const stateColors: Record<Props['state'], string> = {
    accepting: theme.palette.primary.main,
    loading: theme.palette.primary.main,
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: lighten(stateColors[state], 0.9),
        borderColor: stateColors[state],
        borderStyle: state == 'accepting' ? 'dashed' : 'solid',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        padding: 1,
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
};

export default DropZoneContainer;
