import { ArrowForward } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagManager from 'features/tags/components/TagManager';
import { ZetkinTag } from 'utils/types/zetkin';

interface TagConfigRowProps {
  assignedTags: ZetkinTag[];
  italic?: boolean;
  numRows: number;
  onAssignTag: (tag: ZetkinTag) => void;
  onUnassignTag: (tag: ZetkinTag) => void;
  title: string;
}

const TagConfigRow: FC<TagConfigRowProps> = ({
  assignedTags,
  italic,
  numRows,
  onAssignTag,
  onUnassignTag,
  title,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Box
          alignItems="flex-start"
          display="flex"
          justifyContent="space-between"
          paddingTop={1}
          width="50%"
        >
          <Box display="flex" sx={{ wordBreak: 'break-all' }} width="100%">
            <Typography fontStyle={italic ? 'italic' : ''}>{title}</Typography>
          </Box>
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
        </Box>
        <Box width="50%">
          <TagManager
            assignedTags={assignedTags}
            onAssignTag={(tag) => onAssignTag(tag)}
            onUnassignTag={(tag) => onUnassignTag(tag)}
          />
        </Box>
      </Box>
      <Typography color="secondary">
        <Msg
          id={messageIds.configuration.configure.tags.numberOfRows}
          values={{ numRows }}
        />
      </Typography>
    </Box>
  );
};

export default TagConfigRow;
