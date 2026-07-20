import { Warning, ArrowForward } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagManager from 'features/tags/components/TagManager';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { oldThemePalette } from 'oldThemePalette';

interface TagConfigRowProps {
  assignedTags: ZetkinAppliedTag[];
  italic?: boolean;
  numRows: number;
  onAssignTag: (tag: ZetkinAppliedTag) => void;
  onUnassignTag: (tag: ZetkinAppliedTag) => void;
  score?: number | null;
  title: string;
}

const TagConfigRow: FC<TagConfigRowProps> = ({
  assignedTags,
  italic,
  numRows,
  onAssignTag,
  onUnassignTag,
  score,
  title,
}) => {
  const showScoreWarning =
    assignedTags.length == 1 && score != null && score >= 0.01;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Box
          alignItems="flex-start"
          display="flex"
          flex={1}
          justifyContent="space-between"
          paddingTop={1}
        >
          <Box display="flex" sx={{ wordBreak: 'break-all' }} width="100%">
            <Typography fontStyle={italic ? 'italic' : ''}>{title}</Typography>
          </Box>
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
        </Box>
        <Box flex={1}>
          <TagManager
            assignedTags={assignedTags}
            disableEditTags
            disableValueTags
            onAssignTag={(tag) => onAssignTag(tag)}
            onUnassignTag={(tag) => onUnassignTag(tag)}
          />
          {showScoreWarning && (
            <Box
              display="flex"
              sx={{
                color: oldThemePalette.warning.main,
                marginTop: '8px',
              }}
            >
              <Warning fontSize="small" sx={{ margin: '0px 8px 0px 4px' }} />
              <Typography variant="body2">
                <Msg
                  id={messageIds.configuration.configure.tags.scoreImperfect}
                />
              </Typography>
            </Box>
          )}
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
