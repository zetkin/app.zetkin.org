import { Box } from '@mui/material';
import React from 'react';

import ZUIText from 'zui/components/ZUIText';
import { useMessages } from 'core/i18n';
import messageIds from 'features/organizations/l10n/messageIds';
import ZUILink from 'zui/components/ZUILink';

const CardDescription: React.FC<{ description: string; href?: string }> = ({
  description,
  href,
}) => {
  const messages = useMessages(messageIds);

  return (
    <Box>
      <Box
        sx={{
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          display: '-webkit-box',
          overflow: 'hidden',
        }}
      >
        <ZUIText color={'primary'} variant={'bodySmRegular'}>
          {description}
        </ZUIText>
      </Box>
      {href && (
        <ZUIText variant={'bodySmRegular'}>
          <ZUILink
            hoverUnderline={true}
            href={href}
            text={messages.allEventsList.descriptionReadMore()}
            variant={'secondary'}
          />
        </ZUIText>
      )}
    </Box>
  );
};

export default CardDescription;
