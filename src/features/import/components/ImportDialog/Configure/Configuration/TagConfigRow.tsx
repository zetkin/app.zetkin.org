import { AutoAwesome, ArrowForward } from '@mui/icons-material';
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
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// valueToHsl maps the value on a range from 0 to max
// to colours: rgba(0,0,0,0.87) -> yellow -> red.
// The current default of max is based on the filter defined in useGuessTags.ts.
export function mapScoreToColour(value: number, max: number = 0.25) {
  const v = clamp(Number(value) || 0, 0, max);
  const t = max > 0 ? v / max : 1; // normalized 0..1

  const black = { a: 0.6, b: 0, g: 0, r: 0 };
  const yellow = { a: 1, b: 0, g: 127, r: 255 };
  const red = { a: 1, b: 0, g: 0, r: 255 };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  let from, localT, to;
  if (t <= 0.5) {
    // interpolate black -> yellow for t in [0, 0.5]
    from = black;
    to = yellow;
    localT = t / 0.5;
  } else {
    // interpolate yellow -> red for t in (0.5, 1]
    from = yellow;
    to = red;
    localT = (t - 0.5) / 0.5;
  }

  const r = Math.round(lerp(from.r, to.r, localT));
  const g = Math.round(lerp(from.g, to.g, localT));
  const b = Math.round(lerp(from.b, to.b, localT));
  const a = lerp(from.a, to.a, localT);

  // alpha with up to 2 decimal places
  const alphaStr = Math.round(a * 100) / 100;

  return `rgba(${r}, ${g}, ${b}, ${alphaStr})`;
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
          {assignedTags.length == 1 && assignedTags[0].score != null && (
            <Box
              display="flex"
              sx={{
                color: mapScoreToColour(assignedTags[0].score),
              }}
            >
              <AutoAwesome sx={{ 'margin-right': '5px' }} />
              <Typography variant="body2">
                <Msg
                  id={
                    assignedTags[0].score < 0.01
                      ? messageIds.configuration.configure.orgs.scorePerfect
                      : messageIds.configuration.configure.orgs.scoreImperfect
                  }
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
