import { Typography } from '@mui/material';
import { Box, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useSheets from 'features/import/hooks/useSheets';
import { Column, ColumnKind, Sheet } from 'features/import/utils/types';

interface MappedPreviewProps {
  column: Column;
  columnIndex: number;
  currentSheet: Sheet;
  personIndex: number;
}
const MappedPreview = ({
  column,
  columnIndex,
  currentSheet,
  personIndex,
}: MappedPreviewProps) => {
  const theme = useTheme();

  const { orgId } = useNumericRouteParams();
  const columnOptions = useColumnOptions(orgId);
  const messages = useMessages(messageIds);
  const organizations = useOrganizations();
  const { firstRowIsHeaders } = useSheets();

  const rowIndex = firstRowIsHeaders ? personIndex + 1 : personIndex;
  const columnIsOrg = column.kind === ColumnKind.ORGANIZATION;
  let columnName = '';
  let orgName = '';

  const rowValue =
    currentSheet.rows[personIndex] !== undefined
      ? currentSheet?.rows[rowIndex].data[columnIndex]
      : null;

  columnOptions.forEach((columnOp) => {
    if (
      column.kind === ColumnKind.FIELD &&
      columnOp.value === `field:${column.field}`
    ) {
      columnName = columnOp.label;
    }
  });

  if (column.kind === ColumnKind.ID_FIELD) {
    columnName =
      column.idField === null
        ? ''
        : column.idField === 'id'
        ? messages.configuration.preview.columnHeader.int()
        : messages.configuration.preview.columnHeader.ext();
  }

  if (column.kind === ColumnKind.ORGANIZATION) {
    const orgValueInRow = currentSheet.rows[rowIndex].data[columnIndex];

    const mappedOrg = column.mapping.find(
      (item) => item.value === orgValueInRow
    );

    if (mappedOrg) {
      const org = organizations.data?.find(
        (item) => item.id === mappedOrg.orgId
      );
      orgName = org?.title || '';
    }
    columnName = messages.configuration.preview.columnHeader.org();
  }

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
            (!columnIsOrg && rowValue !== null) || orgName !== ''
              ? 'transparent'
              : theme.palette.transparentGrey.light,
          display: 'flex',
          height: '14px',
        }}
      >
        <Typography variant="body1">
          {columnIsOrg ? orgName : rowValue}
        </Typography>
      </Box>
    </Box>
  );
};

export default MappedPreview;
