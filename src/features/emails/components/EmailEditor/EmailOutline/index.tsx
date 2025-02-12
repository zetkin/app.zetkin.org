import { FC, Fragment } from 'react';
import { Box, Divider } from '@mui/material';

import { EmailContentBlock } from 'features/emails/types';
import BlockListItem from './BlockListItem';

type EmailOutlineProps = {
  blocks: EmailContentBlock[];
};

const EmailOutline: FC<EmailOutlineProps> = ({ blocks }) => {
  return (
    <Box>
      {blocks.map((block, index) => (
        <Fragment key={`${block.kind}-${index}`}>
          <BlockListItem block={block} />
          <Divider />
        </Fragment>
      ))}
    </Box>
  );
};

export default EmailOutline;
