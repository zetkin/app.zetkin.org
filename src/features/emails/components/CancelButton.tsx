import { Button } from '@mui/material';
import { FC } from 'react';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

const CancelButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button onClick={onClick} variant="outlined">
      <Msg id={messageIds.emailActionButtons.cancel} />
    </Button>
  );
};

export default CancelButton;
