import { Box, useTheme } from '@mui/material';
import { Stack, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { useNumericRouteParams } from 'core/hooks';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useSheets from 'features/import/hooks/useSheets';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import { Column, ColumnKind, Sheet } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

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
  const { data } = useTags(orgId);
  const tags = data || [];

  const rowIndex = firstRowIsHeaders ? personIndex + 1 : personIndex;
  const columnIsOrg = column.kind === ColumnKind.ORGANIZATION;
  const columnIsTags = column.kind === ColumnKind.TAG;

  let columnName = '';
  let orgTitle = '';
  let mappedTags: ZetkinTag[] = [];

  const rowValue =
    currentSheet.rows[personIndex] !== undefined
      ? currentSheet?.rows[firstRowIsHeaders ? personIndex + 1 : personIndex]
          .data[columnIndex]
      : null;

  const rowHasValue = rowValue !== null && rowValue !== '';

  console.log(rowHasValue, '??');
  //when column is ID
  if (column.kind === ColumnKind.ID_FIELD) {
    columnName =
      column.idField === null
        ? ''
        : column.idField === 'id'
        ? messages.configuration.preview.columnHeader.int()
        : messages.configuration.preview.columnHeader.ext();
  }

  //when column is field
  if (column.kind === ColumnKind.FIELD) {
    columnOptions.forEach((columnOp) => {
      if (
        column.kind === ColumnKind.FIELD &&
        columnOp.value === `field:${column.field}`
      ) {
        columnName = columnOp.label;
      }
    });
  }

  //when column is org
  if (column.kind === ColumnKind.ORGANIZATION) {
    const orgValueInRow = currentSheet.rows[rowIndex].data[columnIndex];

    const mappedOrg = column.mapping.find(
      (item) => item.value === orgValueInRow
    );

    if (mappedOrg) {
      const org = organizations.data?.find(
        (item) => item.id === mappedOrg.orgId
      );
      orgTitle = org?.title || '';
    }
    columnName = messages.configuration.preview.columnHeader.org();
  }

  //when column is tags
  if (column.kind === ColumnKind.TAG) {
    const tagValueInRow = currentSheet.rows[rowIndex].data[columnIndex];
    const tagIdsInColumn = column.mapping.find(
      (item) => item.value === tagValueInRow
    )?.tagIds;

    mappedTags =
      tagIdsInColumn?.reduce((acc: ZetkinTag[], tagId) => {
        const tag = tags.find((tag) => tag.id === tagId);
        if (tag) {
          return acc.concat(tag);
        }
        return acc;
      }, []) ?? [];

    columnName = messages.configuration.preview.columnHeader.tags();
  }

  return (
    <Box
      key={columnIndex}
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
          backgroundColor:
            columnName !== ''
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
          {columnName}
        </Typography>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          // backgroundColor: rowHasValue
          //   ? 'transparent'
          //   : theme.palette.transparentGrey.light,
          display: 'flex',
          height:
            rowHasValue || orgTitle !== '' || mappedTags.length > 0
              ? 'fit-content'
              : '14px',
          my:
            rowHasValue || orgTitle !== '' || mappedTags.length > 0
              ? '0'
              : '5px',
        }}
      >
        <Typography variant="body1">
          {columnIsOrg && rowValue && orgTitle === '' ? (
            <Msg
              id={messageIds.configuration.preview.notMapped}
              values={{ value: rowValue }}
            />
          ) : (
            orgTitle
          )}
          {columnIsTags && (
            <Stack direction="row" spacing={1}>
              {mappedTags.map((tag, index) => {
                return (
                  <TagChip
                    key={index}
                    noWrappedLabel={true}
                    size="small"
                    tag={tag}
                  />
                );
              })}
            </Stack>
          )}
          {!columnIsOrg && !columnIsTags && rowHasValue ? (
            rowValue
          ) : (
            <Typography
              sx={{ color: theme.palette.grey[400], fontStyle: 'italic' }}
            >
              ({<Msg id={messageIds.configuration.preview.empty} />})
            </Typography>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default MappedPreview;
