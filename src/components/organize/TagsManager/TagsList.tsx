import { useIntl } from 'react-intl';
import { Box, Typography } from '@material-ui/core';

import { ZetkinTag } from 'types/zetkin';

import { groupTags } from './utils';
import TagChip from './TagChip';

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
        {groupedTags.map((group, i) => (
          <Box key={i} mb={1}>
            <Typography variant="overline">{group.title}</Typography>
            <Box
              data-testid={`TagsManager-groupedTags-${group.id}`}
              display="flex"
              flexWrap="wrap"
              style={{ gap: 4 }}
            >
              {group.tags.map((tag) => {
                return (
                  <TagChip key={tag.id} onDelete={onUnassignTag} tag={tag} />
                );
              })}
            </Box>
          </Box>
        ))}
      </>
    );
  }

  //   Flat list of tags
  return (
    <Box display="flex" flexWrap="wrap" style={{ gap: 4 }}>
      {tags
        .sort((tag0, tag1) => tag0.title.localeCompare(tag1.title))
        .map((tag) => {
          return <TagChip key={tag.id} onDelete={onUnassignTag} tag={tag} />;
        })}
    </Box>
  );
};

export default TagsList;
