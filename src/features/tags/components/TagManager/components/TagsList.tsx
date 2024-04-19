import { makeStyles } from '@mui/styles';
import { Box, Tooltip, Typography } from '@mui/material';

import { ZetkinTag } from 'utils/types/zetkin';

import { groupTags } from '../utils';
import TagChip from './TagChip';

import messageIds from '../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

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
    padding: '0.2em 0.7em',
    textOverflow: 'ellipsis',
  },
}));

const TagsList: React.FunctionComponent<{
  cap?: number;
  isGrouped: boolean;
  onUnassignTag?: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ cap = Infinity, isGrouped, onUnassignTag, tags }) => {
  const classes = useStyles();
  const messages = useMessages(messageIds);

  const renderCappedTags = (tags: ZetkinTag[]) => {
    const cappedTags = tags.slice(0, cap);
    const hiddenTags = tags.slice(cap);
    const isCapped = tags.length > cappedTags.length;
    const tooltipTitle =
      hiddenTags
        .slice(0, 3)
        .map((tag) => tag.title)
        .join(', ') + (hiddenTags.length > 3 ? ', ...' : '');

    return (
      <>
        {cappedTags.map((tag) => {
          return <TagChip key={tag.id} onDelete={onUnassignTag} tag={tag} />;
        })}
        {isCapped ? (
          <Tooltip title={tooltipTitle}>
            <Box border={2} className={classes.chip}>
              {`+${hiddenTags.length}`}
            </Box>
          </Tooltip>
        ) : null}
      </>
    );
  };

  if (isGrouped) {
    const groupedTags = groupTags(tags, messages.manager.ungroupedHeader());

    return (
      <>
        {groupedTags.map((group, i) => {
          return (
            <Box key={i} mb={1}>
              <Typography variant="overline">{group.title}</Typography>
              <Box
                data-testid={`TagManager-groupedTags-${group.id}`}
                display="flex"
                flexWrap="wrap"
                style={{ gap: 4 }}
              >
                {renderCappedTags(group.tags)}
              </Box>
            </Box>
          );
        })}
      </>
    );
  }

  //   Flat list of tags
  const sortedTags = tags
    .concat()
    .sort((tag0, tag1) => tag0.title.localeCompare(tag1.title));

  return (
    <Box display="flex" flexWrap="wrap" style={{ gap: 4 }}>
      {renderCappedTags(sortedTags)}
    </Box>
  );
};

export default TagsList;
