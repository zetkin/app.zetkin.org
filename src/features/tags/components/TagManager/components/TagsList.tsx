import { Box, Typography } from '@mui/material';

import { ZetkinTag } from 'utils/types/zetkin';

import { groupTags } from '../utils';
import PseudoTagChip from './PseudoTagChip';
import TagChip from './TagChip';

import messageIds from '../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const TagsList: React.FunctionComponent<{
  cap?: number;
  isGrouped: boolean;
  onUnassignTag?: (tag: ZetkinTag) => void;
  tags: ZetkinTag[];
}> = ({ cap = Infinity, isGrouped, onUnassignTag, tags }) => {
  const messages = useMessages(messageIds);

  if (isGrouped) {
    const groupedTags = groupTags(tags, messages.manager.ungroupedHeader());

    return (
      <>
        {groupedTags.map((group, i) => {
          const cappedTags = group.tags.slice(0, cap);
          const isCapped = group.tags.length > cappedTags.length;

          return (
            <Box key={i} mb={1}>
              <Typography variant="overline">{group.title}</Typography>
              <Box
                data-testid={`TagManager-groupedTags-${group.id}`}
                display="flex"
                flexWrap="wrap"
                style={{ gap: 4 }}
              >
                {cappedTags.map((tag) => {
                  return (
                    <TagChip key={tag.id} onDelete={onUnassignTag} tag={tag} />
                  );
                })}
                {isCapped ? (
                  <PseudoTagChip
                    text={`+${group.tags.length - cappedTags.length}`}
                  />
                ) : null}
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
    .sort((tag0, tag1) => tag0.title.localeCompare(tag1.title))
    .slice(0, cap);

  const isCapped = tags.length > sortedTags.length;

  return (
    <Box display="flex" flexWrap="wrap" style={{ gap: 4 }}>
      {sortedTags.map((tag) => {
        return <TagChip key={tag.id} onDelete={onUnassignTag} tag={tag} />;
      })}
      {isCapped ? (
        <PseudoTagChip text={`+${tags.length - sortedTags.length}`} />
      ) : null}
    </Box>
  );
};

export default TagsList;
