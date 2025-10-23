import { FC } from 'react';
import { Box, lighten, Typography, useTheme } from '@mui/material';

import { DEFAULT_TAG_COLOR } from 'features/tags/components/TagManager/utils';
import messageIds from 'features/views/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinAppliedTag } from 'utils/types/zetkin';

interface CellContentProps {
  tag: ZetkinAppliedTag;
}

const ValueTagCell: FC<CellContentProps> = ({ tag }) => {
  const isEmpty = !tag.value || !tag.value.toString().trim().length;
  const theme = useTheme();

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: lighten(tag.color || DEFAULT_TAG_COLOR, 0.7),
        borderLeft: `4px solid ${tag.color || DEFAULT_TAG_COLOR}`,
        color: 'black',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Typography
        color={
          isEmpty
            ? theme.palette.mode === 'dark'
              ? theme.palette.grey[700]
              : 'secondary'
            : ''
        }
        fontStyle={isEmpty ? 'italic' : ''}
        sx={{
          maxWidth: '90%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {isEmpty ? (
          <Msg id={messageIds.cells.personTag.emptyValue} />
        ) : (
          tag.value
        )}
      </Typography>
    </Box>
  );
};

export default ValueTagCell;
