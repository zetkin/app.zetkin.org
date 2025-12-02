import { ReactElement } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { BadgeOutlined } from '@mui/icons-material';

import { CellData } from 'features/import/types';

interface PreviewGridProps {
  isImportID?: boolean;
  columnHeader?: string;
  unmappedRow?: boolean;
  rowValue: ReactElement | CellData;
  emptyLabel?: string;
}

const PreviewGrid = ({
  isImportID = false,
  columnHeader,
  unmappedRow,
  rowValue,
  emptyLabel,
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
          alignItems: 'center',

          backgroundColor: columnHeader
            ? 'transparent'
            : theme.palette.transparentGrey.light,
          display: 'flex',
          mb: 0.5,
          minHeight: '22px',
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
        {isImportID && (
          <BadgeOutlined color="secondary" fontSize="small" sx={{ ml: 1 }} />
        )}
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor:
            unmappedRow && !emptyLabel
              ? theme.palette.transparentGrey.light
              : 'transparent',
          display: 'flex',
          height: '14px',
          minWidth: '150px',
          mt: 0.5,
        }}
      >
        {emptyLabel ? (
          <Typography
            sx={{
              color: theme.palette.grey[400],
              fontStyle: 'italic',
            }}
          >
            ({emptyLabel})
          </Typography>
        ) : (
          <Typography variant="body1">{rowValue}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default PreviewGrid;
