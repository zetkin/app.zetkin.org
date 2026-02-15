import { ArrowForward } from '@mui/icons-material';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagManager from 'features/tags/components/TagManager';
import { ZetkinAppliedTag } from 'utils/types/zetkin';

interface TagConfigRowProps {
  assignedTags: ZetkinAppliedTag[];
  italic?: boolean;
  numRows: number;
  onAssignTag: (tag: ZetkinAppliedTag) => void;
  onUnassignTag: (tag: ZetkinAppliedTag) => void;
  title: string;
  scores?: Record<string, number>;
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// valueToHsl maps the value on a range from 0 to max to the colours green to red.
// The current default of max is based on the filter defined in useGuessTags.ts.
export function valueToHsl(value: number, max: number = 0.25) {
  const v = clamp(Number(value) || 0, 0, max);
  const t = v / max;
  const hue = 120 - Math.round(t * 120);
  return `hsl(${hue}, 70%, 45%)`;
}

const TagConfigRow: FC<TagConfigRowProps> = ({
  assignedTags,
  italic,
  numRows,
  onAssignTag,
  onUnassignTag,
  title,
  scores,
}) => {
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
        </Box>
        {!!scores && (
          <Box width={50}>
            {scores[title] != undefined && (
              <Box
                sx={{
                  backgroundColor: valueToHsl(scores[title]),
                  borderRadius: 5,
                  height: 20,
                  margin: '10px 15px',
                  width: 20,
                }}
              />
            )}
          </Box>
        )}
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
