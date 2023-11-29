import { makeStyles } from '@mui/styles';
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import { ZetkinTag } from 'utils/types/zetkin';
import { CellData, ColumnKind } from 'features/import/utils/types';

interface RowValueProps {
  kind: ColumnKind;
  rowValue: CellData;
  orgTitle: string;
  tags: ZetkinTag[];
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

const RowValue = ({ kind, rowValue, orgTitle, tags }: RowValueProps) => {
  const theme = useTheme();
  const classes = useStyles();

  const columnIsOrg = kind === ColumnKind.ORGANIZATION;
  const columnIsTags = kind === ColumnKind.TAG;
  const notMapped = (
    <Msg
      id={messageIds.configuration.preview.notMapped}
      values={{ value: rowValue }}
    />
  );
  const emptyValue = rowValue === null || rowValue === '';

  const displayedTags = tags.slice(0, 3);
  const hiddenTags = tags.slice(3);
  const tooltipTitle = hiddenTags.map((tag) => tag.title).join(', ');

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
          {columnIsTags &&
            (tags.length === 0 ? (
              notMapped
            ) : (
              <Stack direction="row" mt="5px" spacing={1} width="300px">
                {displayedTags.map((tag) => (
                  <TagChip
                    key={tag.id}
                    noWrappedLabel={true}
                    size="small"
                    tag={tag}
                  />
                ))}
                {hiddenTags.length > 0 && (
                  <Tooltip title={tooltipTitle}>
                    <Box border={2} className={classes.chip}>
                      {`${displayedTags.length > 0 ? '+' : ''}${
                        hiddenTags.length
                      }`}
                    </Box>
                  </Tooltip>
                )}
              </Stack>
            ))}
          {!columnIsOrg && !columnIsTags && rowValue}
        </>
      )}
    </>
  );
};

export default RowValue;
