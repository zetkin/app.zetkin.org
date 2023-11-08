import { ArrowForward } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagManager from 'features/tags/components/TagManager';

interface TagConfigRowProps {
  italic?: boolean;
  numRows: number;
  title: string;
}

const TagConfigRow: FC<TagConfigRowProps> = ({ italic, numRows, title }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          width="50%"
        >
          <Typography fontStyle={italic ? 'italic' : ''}>{title}</Typography>
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
        </Box>
        <Box width="50%">
          <TagManager
            assignedTags={[]}
            onAssignTag={() => null}
            onUnassignTag={() => null}
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
