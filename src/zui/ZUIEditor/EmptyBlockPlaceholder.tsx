import { Box, Link, Typography } from '@mui/material';
import { useCommands, usePositioner } from '@remirror/react';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

const EmptyBlockPlaceholder: FC = () => {
  const positioner = usePositioner<{ pos: number }>('emptyBlockStart');
  const { insertSlash } = useCommands();

  return (
    <Box ref={positioner.ref} position="relative">
      {positioner.active && (
        <Typography
          sx={{
            '&:hover': {
              opacity: 1,
            },
            left: positioner.x,
            opacity: 0.5,
            position: 'absolute',
            top: positioner.y,
            transition: 'opacity 0.5s',
          }}
        >
          <Msg
            id={messageIds.editor.placeholder.label}
            values={{
              link: (
                <Link
                  onClick={() => insertSlash()}
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  <Msg id={messageIds.editor.placeholder.link} />
                </Link>
              ),
            }}
          />
        </Typography>
      )}
    </Box>
  );
};

export default EmptyBlockPlaceholder;
