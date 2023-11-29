import { Stack, Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import { ZetkinTag } from 'utils/types/zetkin';
import { CellData, ColumnKind } from 'features/import/utils/types';

interface RowValueProps {
  emptyValue: boolean;
  kind: ColumnKind;
  rowValue: CellData;
  orgTitle: string;
  tags: ZetkinTag[];
}
const RowValue = ({
  emptyValue,
  kind,
  rowValue,
  orgTitle,
  tags,
}: RowValueProps) => {
  const theme = useTheme();

  const columnIsOrg = kind === ColumnKind.ORGANIZATION;
  const columnIsTags = kind === ColumnKind.TAG;
  const notMapped = (
    <Msg
      id={messageIds.configuration.preview.notMapped}
      values={{ value: rowValue }}
    />
  );

  return (
    <>
      {emptyValue && (
        <Typography
          sx={{ color: theme.palette.grey[400], fontStyle: 'italic' }}
        >
          ({<Msg id={messageIds.configuration.preview.empty} />})
        </Typography>
      )}
      {!emptyValue && (
        <>
          {columnIsOrg && orgTitle === '' ? notMapped : orgTitle}
          {columnIsTags && tags.length === 0 ? (
            notMapped
          ) : (
            <Stack direction="row" spacing={1}>
              {tags.map((tag, index) => {
                return (
                  <TagChip
                    key={`preview-tag-${index}`}
                    noWrappedLabel={true}
                    size="small"
                    tag={tag}
                  />
                );
              })}
            </Stack>
          )}
          {!columnIsOrg && !columnIsTags && rowValue}
        </>
      )}
    </>
  );
};

export default RowValue;
