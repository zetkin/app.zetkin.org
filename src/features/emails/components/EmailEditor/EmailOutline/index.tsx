import { FC, Fragment } from 'react';
import { Box, Divider } from '@mui/material';

import { EmailContentBlock } from 'features/emails/types';
import BlockListItem from './BlockListItem';

type EmailOutlineProps = {
  blocks: EmailContentBlock[];
  selectedBlockIndex: number;
};

const EmailOutline: FC<EmailOutlineProps> = ({
  blocks,
  selectedBlockIndex,
}) => {
  return (
    <Box>
      {blocks.map((block, index) => (
        <Fragment key={`${block.kind}-${index}`}>
          <BlockListItem block={block} selected={index == selectedBlockIndex} />
          <Divider />
        </Fragment>
      ))}
    </Box>
  );
};

export default EmailOutline;
