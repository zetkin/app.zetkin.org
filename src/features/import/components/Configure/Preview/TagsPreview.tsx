import { makeStyles } from '@mui/styles';
import { Tooltip } from '@mui/material';
import { Box, Stack } from '@mui/system';

import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import { useMessages } from 'core/i18n';
import { ZetkinTag } from 'utils/types/zetkin';
import { ColumnKind, Sheet } from 'features/import/utils/types';

interface TagPreviewProps {
  currentSheet: Sheet;
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

const TagsPreview = ({ tags, currentSheet }: TagPreviewProps) => {
  const messages = useMessages(messageIds);
  const classes = useStyles();

  const hasMapped = currentSheet.columns.some(
    (column) => column.kind === ColumnKind.TAG && column.mapping.length > 0
  );

  const displayedTags = tags?.slice(0, 3);
  const hiddenTags = tags?.slice(3);
  const tooltipTitle = hiddenTags?.map((tag) => tag.title).join(', ');
  return (
    <PreviewGrid
      columnHeader={messages.configuration.preview.columnHeader.tags()}
      emptyLabel={
        hasMapped && tags.length === 0
          ? messages.configuration.preview.noTags()
          : ''
      }
      rowValue={
        tags.length > 0 ? (
          <Stack direction="row" maxWidth={'300px'} mt="5px" spacing={1}>
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
        ) : null
      }
      unmappedRow={!hasMapped}
    />
  );
};

export default TagsPreview;
