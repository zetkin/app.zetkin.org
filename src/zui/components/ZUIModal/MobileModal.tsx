import { FC } from 'react';

import Drawer from '../ZUIDrawerModal/Drawer';
import { ZUIModalProps } from '.';
import ModalContent from './ModalContent';

const MobileModal: FC<ZUIModalProps> = ({
  allowPropagation = false,
  children,
  onClose,
  open,
  primaryButton,
  secondaryButton,
  title,
}) => {
  return (
    <Drawer allowPropagation={allowPropagation} onClose={onClose} open={open}>
      <ModalContent
        isMobile={true}
        onClose={onClose}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        title={title}
      >
        {children}
      </ModalContent>
    </Drawer>
  );
};

export default MobileModal;
