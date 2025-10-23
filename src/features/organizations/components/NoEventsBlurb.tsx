import { Box } from '@mui/material';
import { FC } from 'react';

import ZUIText from 'zui/components/ZUIText';

type Props = { description?: string; title: string };

const NoEventsBlurb: FC<Props> = ({ description, title }) => {
  return (
    <Box
      sx={(theme) => ({
        alignItems: 'center',
        bgcolor:
          theme.palette.mode === 'dark'
            ? theme.palette.grey[800]
            : theme.palette.grey[200],
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        my: 4,
        p: 2,
      })}
    >
      <ZUIText variant="headingMd">{title}</ZUIText>
      {description && <ZUIText variant="bodySmRegular">{description}</ZUIText>}
    </Box>
  );
};

export default NoEventsBlurb;
