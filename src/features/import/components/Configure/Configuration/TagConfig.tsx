import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { TagColumn } from 'features/import/utils/types';
import TagConfigRow from './TagConfigRow';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumns';
import { ZetkinTag } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

interface TagConfigProps {
  uiDataColumn: UIDataColumn & { originalColumn: TagColumn };
}

const TagConfig: FC<TagConfigProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);
  return (
    <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
      <Typography variant="h5">
        <Msg id={messageIds.configuration.configure.tags.header} />
      </Typography>
      <Box alignItems="center" display="flex" paddingBottom={2} paddingTop={2}>
        <Box width="50%">
          <Typography variant="body2">
            {uiDataColumn.title.toLocaleUpperCase()}
          </Typography>
        </Box>
        <Box width="50%">
          <Typography variant="body2">
            {messages.configuration.configure.tags
              .tagsHeader()
              .toLocaleUpperCase()}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ overflowY: 'scroll' }}>
        {uiDataColumn.uniqueValues.map((uniqueValue, index) => (
          <>
            {index != 0 && <Divider sx={{ marginY: 1 }} />}
            <TagConfigRow
              assignedTags={uiDataColumn.getAssignedTags(uniqueValue)}
              numRows={uiDataColumn.numRowsByUniqueValue[uniqueValue]}
              onAssignTag={(tag: ZetkinTag) =>
                uiDataColumn.assignTag(tag, uniqueValue)
              }
              onUnassignTag={(tag: ZetkinTag) =>
                uiDataColumn.unAssignTag(tag, uniqueValue)
              }
              title={uniqueValue.toString()}
            />
          </>
        ))}
        {uiDataColumn.numberOfEmptyRows > 0 && (
          <>
            <Divider sx={{ marginY: 1 }} />
            <TagConfigRow
              assignedTags={uiDataColumn.getAssignedTags(null)}
              italic
              numRows={uiDataColumn.numberOfEmptyRows}
              onAssignTag={(tag: ZetkinTag) =>
                uiDataColumn.assignTag(tag, null)
              }
              onUnassignTag={(tag: ZetkinTag) =>
                uiDataColumn.unAssignTag(tag, null)
              }
              title={messages.configuration.configure.tags.empty()}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default TagConfig;
