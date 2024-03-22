import { ArrowDropDown } from '@mui/icons-material';
import { Button, Popper } from '@mui/material';
import { FC, useState } from 'react';

import EmailDelivery from './EmailDelivery';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinEmail } from 'utils/types/zetkin';

interface DeliveryButtonProps {
  email: ZetkinEmail;
}

const DeliveryButton: FC<DeliveryButtonProps> = ({ email }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button
        endIcon={<ArrowDropDown />}
        onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)}
        variant="contained"
      >
        <Msg id={messageIds.emailActionButtons.delivery} />
      </Button>
      <Popper
        anchorEl={anchorEl}
        open={!!anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 10 }}
      >
        <EmailDelivery
          email={email}
          onClose={() => setAnchorEl(null)}
          orgId={email.organization.id}
        />
      </Popper>
    </>
  );
};

export default DeliveryButton;
