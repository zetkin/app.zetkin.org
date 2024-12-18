import { FC, useState } from 'react';
import { Box, Typography } from '@mui/material';

import useAreaTagging from 'features/geography/hooks/useAreaTagging';
import useAreaTags from 'features/geography/hooks/useAreaTags';
import { ZetkinArea } from 'features/geography/types';
import TagManager from 'features/tags/components/TagManager';
import GroupToggle from 'features/tags/components/TagManager/components/GroupToggle';
import ZUIFuture from 'zui/ZUIFuture';

type Props = {
  area: ZetkinArea;
};

const TagsSection: FC<Props> = ({ area }) => {
  const [grouped, setGrouped] = useState(true);
  const tagsFuture = useAreaTags(area.organization.id, area.id);
  const { assignTag, unassignTag } = useAreaTagging(
    area.organization.id,
    area.id
  );

  return (
    <ZUIFuture future={tagsFuture} ignoreDataWhileLoading>
      {(tags) => (
        <Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            mb={2}
            minHeight={38}
          >
            <Typography variant="h6">Area tags</Typography>
            <Box>
              <GroupToggle
                checked={grouped}
                onChange={() => setGrouped(!grouped)}
              />
            </Box>
          </Box>
          <TagManager
            assignedTags={tags}
            groupTags={grouped}
            onAssignTag={(tag) => {
              assignTag(tag.id, tag.value);
            }}
            onUnassignTag={(tag) => {
              unassignTag(tag.id);
            }}
          />
        </Box>
      )}
    </ZUIFuture>
  );
};

export default TagsSection;
