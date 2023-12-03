import { makeStyles } from '@mui/styles';
import { Box, Stack, Theme } from '@mui/system';
import { Tooltip, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import { ZetkinTag } from 'utils/types/zetkin';
import { ColumnKind, Sheet } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

interface TagPreviewProps {
  currentSheet: Sheet;
  tags: ZetkinTag[];
  theme: Theme;
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

const TagsPreview = ({ tags, currentSheet, theme }: TagPreviewProps) => {
  const messages = useMessages(messageIds);
  const classes = useStyles();

  const hasMapped = currentSheet.columns.some(
    (column) => column.kind === ColumnKind.TAG && column.mapping.length > 0
  );
  const noTags = (
    <Typography
      sx={{
        color: theme.palette.grey[400],
        fontStyle: 'italic',
      }}
    >
      (<Msg id={messageIds.configuration.preview.noTags} />)
    </Typography>
  );

  const displayedTags = tags?.slice(0, 3);
  const hiddenTags = tags?.slice(3);
  const tooltipTitle = hiddenTags?.map((tag) => tag.title).join(', ');
  return (
    <PreviewGrid
      columnHeader={messages.configuration.preview.columnHeader.tags()}
      rowValue={
        hasMapped && tags.length === 0 ? (
          noTags
        ) : (
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
        )
      }
      unmappedRow={!hasMapped}
    />
  );
};

export default TagsPreview;
