import { makeStyles } from '@mui/styles';
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import { ZetkinTag } from 'utils/types/zetkin';
import { CellData, ColumnKind } from 'features/import/utils/types';

interface RowValueProps {
  hasMapped: boolean;
  kind: ColumnKind;
  rowValue?: CellData;
  tags?: ZetkinTag[];
}

const useStyles = makeStyles((theme) => ({
  chip: {
    borderColor: theme.palette.grey[500],
    borderRadius: '1em',
    borderWidth: '1px',
    color: theme.palette.text.secondary,
    cursor: 'default',
    display: 'flex',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.1em 0.7em',
    textOverflow: 'ellipsis',
  },
}));

const RowValue = ({ hasMapped, kind, rowValue, tags }: RowValueProps) => {
  const theme = useTheme();
  const classes = useStyles();
  // const rowValue = rowValues
  //   .filter((value) => value !== '' && value !== null)
  //   .join(',');

  // const notMapped = (
  //   <Msg
  //     id={messageIds.configuration.preview.notMapped}
  //     values={{ value: rowValue }}
  //   />
  // );
  console.log(rowValue, ' rowvalue');
  console.log(tags, ' tags');

  const noTags = <Msg id={messageIds.configuration.preview.noTags} />;
  const emptyValue =
    (rowValue === null || rowValue === '') && kind !== ColumnKind.TAG;

  const displayedTags = tags?.slice(0, 3);
  const hiddenTags = tags?.slice(3);
  const tooltipTitle = hiddenTags?.map((tag) => tag.title).join(', ');

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
          {kind === ColumnKind.ORGANIZATION &&
            (rowValue === '' ? noTags : rowValue)}
          {kind === ColumnKind.TAG &&
            (tags?.length === 0 ? (
              noTags
            ) : (
              <Stack direction="row" mt="5px" spacing={1} width="300px">
                {displayedTags?.map((tag) => (
                  <TagChip
                    key={tag.id}
                    noWrappedLabel={true}
                    size="small"
                    tag={tag}
                  />
                ))}
                {hiddenTags!.length > 0 && (
                  <Tooltip title={tooltipTitle}>
                    <Box border={2} className={classes.chip}>
                      {`${displayedTags!.length > 0 ? '+' : ''}${
                        hiddenTags?.length
                      }`}
                    </Box>
                  </Tooltip>
                )}
              </Stack>
            ))}
          {(kind === ColumnKind.FIELD || kind === ColumnKind.UNKNOWN) &&
            rowValue}
        </>
      )}
    </>
  );
};

export default RowValue;
