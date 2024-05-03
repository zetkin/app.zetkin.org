import { FC } from 'react';
import { Box, lighten, Typography } from '@mui/material';

import { DEFAULT_TAG_COLOR } from 'features/tags/components/TagManager/utils';
import messageIds from 'features/views/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinTag } from 'utils/types/zetkin';

interface CellContentProps {
  tag: ZetkinTag;
}

const ValueTagCellContent: FC<CellContentProps> = ({ tag }) => {
  const isEmpty = !tag.value || !tag.value.toString().trim().length;

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: lighten(tag.color || DEFAULT_TAG_COLOR, 0.7),
        borderLeft: `4px solid ${tag.color || DEFAULT_TAG_COLOR}`,
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Typography
        color={isEmpty ? 'secondary' : ''}
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

export default ValueTagCellContent;
