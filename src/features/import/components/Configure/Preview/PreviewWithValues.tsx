import { Typography } from '@mui/material';
import { Box, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useSheets from 'features/import/hooks/useSheets';
import { Column, ColumnKind, Sheet } from 'features/import/utils/types';

interface PreviewWithValuesProps {
  column: Column;
  columnIndex: number;
  currentSheet: Sheet;
  personIndex: number;
}
const PreviewWithValues = ({
  column,
  columnIndex,
  currentSheet,
  personIndex,
}: PreviewWithValuesProps) => {
  const theme = useTheme();

  const { orgId } = useNumericRouteParams();
  const columnOptions = useColumnOptions(orgId);
  const messages = useMessages(messageIds);

  const { firstRowIsHeaders } = useSheets();

  let columnName = '';
  const orgName = '';

  const rowValue =
    currentSheet.rows[personIndex] !== undefined
      ? currentSheet?.rows[firstRowIsHeaders ? personIndex + 1 : personIndex]
          .data[columnIndex]
      : null;
  columnOptions.forEach((columnOp) => {
    if (column.kind === ColumnKind.ID_FIELD) {
      columnName =
        column.idField === null
          ? ''
          : column.idField === 'id'
          ? messages.configuration.preview.columnHeader.int()
          : messages.configuration.preview.columnHeader.ext();
    }
    if (
      column.kind === ColumnKind.FIELD &&
      columnOp.value === `field:${column.field}`
    ) {
      columnName = columnOp.label;
    }
  });
  return (
    <Box
      key={columnIndex}
      flexGrow={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mr: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor:
            columnName !== ''
              ? 'transparent'
              : theme.palette.transparentGrey.light,
          height: '14px',
          mb: 1,
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
          {columnName}
        </Typography>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor:
            rowValue !== null && column.kind !== ColumnKind.ORGANIZATION
              ? 'transparent'
              : theme.palette.transparentGrey.light,
          display: 'flex',
          height: '14px',
        }}
      >
        <Typography variant="body1">
          {column.kind === ColumnKind.ORGANIZATION ? orgName : rowValue}
        </Typography>
      </Box>
    </Box>
  );
};

export default PreviewWithValues;
