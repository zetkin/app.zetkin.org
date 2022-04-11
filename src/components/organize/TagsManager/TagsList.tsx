import { useIntl } from 'react-intl';
import { Box, Typography } from '@material-ui/core';

import { ZetkinTag } from 'types/zetkin';

import { groupTags } from './utils';
import TagChip from './TagChip';

/**
 *
 * This component can be used on it's own without the TagsManagerContext
 */
const TagsList: React.FunctionComponent<{
  isGrouped: boolean;
  onUnassignTag?: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ tags, isGrouped, onUnassignTag }) => {
  const intl = useIntl();

  if (isGrouped) {
    const groupedTags = groupTags(
      tags,
      intl.formatMessage({
        id: 'misc.tags.tagsManager.ungroupedHeader',
      })
    );

    return (
      <>
        {Object.entries(groupedTags).map(([id, group], i) => (
          <Box key={i} mb={1}>
            <Typography variant="overline">{group.title}</Typography>
            <Box
              data-testid={`TagsManager-groupedTags-${id}`}
              display="flex"
              flexWrap="wrap"
              style={{ gap: 8 }}
            >
              {group.tags.map((tag, i) => {
                return <TagChip key={i} onDelete={onUnassignTag} tag={tag} />;
              })}
            </Box>
          </Box>
        ))}
      </>
    );
  }

  //   Flat list of tags
  return (
    <Box display="flex" flexWrap="wrap" style={{ gap: 8 }}>
      {tags.map((tag, i) => {
        return <TagChip key={i} onDelete={onUnassignTag} tag={tag} />;
      })}
    </Box>
  );
};

export default TagsList;
