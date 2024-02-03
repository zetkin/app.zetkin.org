import { Box, Typography } from '@mui/material';

import { ZetkinTag } from 'utils/types/zetkin';

import { groupTags } from '../utils';
import TagChip from './TagChip';

import messageIds from '../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const TagsList: React.FunctionComponent<{
  isGrouped: boolean;
  onUnassignTag?: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ tags, isGrouped, onUnassignTag }) => {
  const messages = useMessages(messageIds);

  if (isGrouped) {
    const groupedTags = groupTags(tags, messages.manager.ungroupedHeader());

    return (
      <>
        {groupedTags.map((group, i) => (
          <Box key={i} mb={1}>
            <Typography variant="overline">{group.title}</Typography>
            <Box
              data-testid={`TagManager-groupedTags-${group.id}`}
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
  const sortedTags = tags
    .concat()
    .sort((tag0, tag1) => tag0.title.localeCompare(tag1.title));

  return (
    <Box display="flex" flexWrap="wrap" style={{ gap: 4 }}>
      {sortedTags.map((tag) => {
        return <TagChip key={tag.id} onDelete={onUnassignTag} tag={tag} />;
      })}
    </Box>
  );
};

export default TagsList;
