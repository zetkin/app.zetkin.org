import { ReactElement } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { BadgeOutlined } from '@mui/icons-material';

import { CellData } from 'features/import/types';
import useSheets from 'features/import/hooks/useSheets';

function matchesImportID(importID: string | null, columnHeader?: string) {
  if (!importID || !columnHeader) {
    return false;
  }

  const headerToID: Record<string, string> = {
    Email: 'email',
    'External ID': 'ext_id',
    ID: 'id',
  };

  const normalizedHeader = columnHeader.trim();
  return headerToID[normalizedHeader] == importID;
}

interface PreviewGridProps {
  columnHeader?: string;
  unmappedRow?: boolean;
  rowValue: ReactElement | CellData;
  emptyLabel?: string;
}
const PreviewGrid = ({
  columnHeader,
  unmappedRow,
  rowValue,
  emptyLabel,
}: PreviewGridProps) => {
  const theme = useTheme();
  const { sheets, selectedSheetIndex } = useSheets();
  const importID = sheets[selectedSheetIndex].importID;

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
      <Box alignContent="align-center" display="flex">
        <Box
          sx={{
            backgroundColor: columnHeader
              ? 'transparent'
              : theme.palette.transparentGrey.light,
            height: '14px',
            mb: 0.5,
            minWidth: matchesImportID(importID, columnHeader) ? '0px' : '150px',
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
        {matchesImportID(importID, columnHeader) && (
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
