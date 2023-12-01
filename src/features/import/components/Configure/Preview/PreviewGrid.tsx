import { ReactElement } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { CellData } from 'features/import/utils/types';

interface PreviewGridProps {
  columnHeader?: string;
  unmappedRow?: boolean;
  rowValue: ReactElement | CellData;
}
const PreviewGrid = ({
  columnHeader,
  unmappedRow,
  rowValue,
}: PreviewGridProps) => {
  const theme = useTheme();

  return (
    <Box
      flexGrow={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 'fit-content',
        overflowX: 'auto',
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: columnHeader
            ? 'transparent'
            : theme.palette.transparentGrey.light,
          height: '14px',
          mb: 0.5,
          minWidth: '150px',
        }}
      >
        <Typography
          fontSize="12px"
          sx={{
            color: theme.palette.grey['600'],
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
          variant="body1"
        >
          {columnHeader}
        </Typography>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: unmappedRow
            ? theme.palette.transparentGrey.light
            : 'transparent',
          display: 'flex',
          height: '14px',
          minWidth: '150px',
          mt: 0.5,
        }}
      >
        <Typography variant="body1">{rowValue}</Typography>
      </Box>
    </Box>
  );
};

export default PreviewGrid;
