import { Box, Typography } from '@material-ui/core';

import { ZetkinTag } from 'types/zetkin';

import TagChip from './TagChip';
import { TagsGroups } from './types';

const TagsList: React.FunctionComponent<{
  groupedTags: TagsGroups;
  isGrouped: boolean;
  tags: ZetkinTag[];
}> = ({ tags, isGrouped, groupedTags }) => {
  if (isGrouped) {
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
                // Tag Chip
                return <TagChip key={i} tag={tag} />;
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
        // Tag Chip
        return <TagChip key={i} tag={tag} />;
      })}
    </Box>
  );
};

export default TagsList;
